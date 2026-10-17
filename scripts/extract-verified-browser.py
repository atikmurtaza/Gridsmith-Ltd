#!/usr/bin/env python3
"""Authenticate the pinned browser input; never install a Debian package.

Runtime entry points require Linux directory-relative no-follow operations. The
companion selftest exercises pure predicates on other platforms without claiming
that their filesystem or loader passed the Linux policy.
"""

import argparse
import contextlib
import datetime
import email.utils
import hashlib
import io
import json
import os
import posixpath
import re
import selectors
import stat
import struct
import subprocess
import sys
import tarfile
import tempfile
import time

MANIFEST_SHA256 = "20ac446b365c2e9f08d83355f66e99f78c4065c93c49099c45ebd4754be0cb54"
MANIFEST_BYTES = 229589
KEY_BYTES = 19640
HASH = re.compile(r"[0-9a-f]{64}\Z")
FINGERPRINT = re.compile(r"[0-9A-F]{40}\Z")
PACKAGE = re.compile(r"[a-z0-9][a-z0-9+.-]*(?::amd64)?\Z")
SONAME = re.compile(r"[A-Za-z0-9_+.-]+\.so(?:\.[0-9]+)*\Z")
REPOSITORY = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEADLINE = None
TOP_KEYS = {"schemaVersion", "publisher", "product", "packageVersion", "browserVersion", "platform", "architecture", "artifactType", "source", "provenance", "installation", "keyStatusPolicy", "filesystemPolicy", "runtime"}


class Rejected(Exception):
    def __init__(self, code):
        super().__init__(code)
        self.code = code


def require(condition, code):
    if not condition:
        raise Rejected(code)


def keys(value, expected, code):
    require(type(value) is dict and set(value) == set(expected), code)


def integer(value, minimum=0):
    return type(value) is int and value >= minimum


def digest(data):
    return hashlib.sha256(data).hexdigest()


def canonical_json(value):
    return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=True).encode("ascii")


def unique_json(pairs):
    result = {}
    for key, value in pairs:
        require(key not in result, "JSON_DUPLICATE_KEY")
        result[key] = value
    return result


def parse_json(data):
    try:
        return json.loads(data, object_pairs_hook=unique_json,
                          parse_constant=lambda _: (_ for _ in ()).throw(Rejected("JSON_NONFINITE")))
    except (ValueError, UnicodeError):
        raise Rejected("JSON_MALFORMED") from None


def canonical_member(name, allow_root=False):
    require(type(name) is str and len(name) <= 4096 and not re.search(r"[\x00-\x1f\x7f\\]", name), "ARCHIVE_PATH_CONTROLS")
    require(not name.startswith("/") and not re.match(r"^[A-Za-z]:", name), "ARCHIVE_ABSOLUTE_PATH")
    while name.startswith("./"):
        name = name[2:]
    name = name.rstrip("/")
    require(all(part not in ("", "..", ".") for part in name.split("/")) or (allow_root and name in ("", ".")), "ARCHIVE_PATH_TRAVERSAL")
    return "" if allow_root and name in ("", ".") else name


def contained_link(path, target, subtree):
    require(type(target) is str and target and not re.search(r"[\x00-\x1f\x7f\\]", target), "ARCHIVE_LINK_CONTROLS")
    require(not target.startswith("/") and not re.match(r"^[A-Za-z]:", target), "ARCHIVE_LINK_ESCAPE")
    resolved = posixpath.normpath(posixpath.join(posixpath.dirname(path), target))
    require(resolved == subtree or resolved.startswith(subtree + "/"), "ARCHIVE_LINK_ESCAPE")
    return resolved


def validate_manifest(m):
    keys(m, TOP_KEYS, "CONFIG_SCHEMA")
    for name, expected in {"schemaVersion": 1, "publisher": "Google LLC", "product": "google-chrome-stable", "packageVersion": "155.0.8059.79-1", "browserVersion": "155.0.8059.79", "platform": "linux-amd64", "architecture": "amd64", "artifactType": "deb"}.items():
        require(type(m[name]) is type(expected) and m[name] == expected, "CONFIG_IDENTITY")
    source = m["source"]
    keys(source, {"url", "allowedOrigin", "redirectPolicy", "bytes", "sha256"}, "CONFIG_SOURCE_SCHEMA")
    require(source == {"url": "https://dl.google.com/linux/chrome/deb/pool/main/g/google-chrome-stable/google-chrome-stable_155.0.8059.79-1_amd64.deb", "allowedOrigin": "https://dl.google.com", "redirectPolicy": "reject", "bytes": 143638568, "sha256": "b7726070ca707965e9a17b38e4f15ba283bf6f65c339626c092862af7b19badc"}, "CONFIG_SOURCE_IDENTITY")
    require(integer(source["bytes"], 1), "CONFIG_SOURCE_SIZE")
    p = m["provenance"]
    expected_p = {"authorityUrl": "https://www.google.com/linuxrepositories/", "keyUrl": "https://dl.google.com/linux/linux_signing_key.pub", "primaryFingerprint": "EB4C1BFD4F042F6DDDCCEC917721F63BD38B4796", "signerFingerprint": "0E225917414670F4442C250DFD533C07C264648F", "keyPath": "config/browser-provenance/google-linux-signing-key.asc", "keySha256": "54dea5f6c2a26091578cf52a999cebc6b64df478d37ad4dce96376b711e3b27c", "inReleasePath": "config/browser-provenance/google-chrome-155.InRelease", "inReleaseSha256": "256e3048bac6b5238fcae0f6295b66c6ed3f8db027c72d6ab34080abf10e1b13", "inReleaseBytes": 2548, "packagesPath": "config/browser-provenance/google-chrome-155.Packages", "packagesSha256": "cafc994f194c588cc63e4031ce54f7297bc2591ef336d0da7300b41e1b4fec41", "packagesBytes": 6207, "signedIndexPath": "main/binary-amd64/Packages", "signedReleaseDate": "Wed, 14 Oct 2026 09:01:24 UTC", "snapshotApprovalDate": "2026-10-14", "signerCreatedUnix": 1736268781, "signerExpiresUnix": 1830876781}
    keys(p, expected_p, "CONFIG_PROVENANCE_SCHEMA")
    require(p == expected_p and all(type(p[k]) is type(v) for k, v in expected_p.items()), "CONFIG_PROVENANCE_IDENTITY")
    require(canonical_json(m["installation"]) == canonical_json({"skipDownload": "true", "persistentExtractedCache": False, "explicitInstallers": "reject", "checkoutCredentials": "absent-during-lifecycle", "lifecycleScripts": "enabled", "optionalDependencies": "enabled"}), "CONFIG_INSTALLATION_POLICY")
    require(canonical_json(m["keyStatusPolicy"]) == canonical_json({"dedicatedKeyring": True, "checkCurrentOfficialMaterial": True, "requirePrimarySelfSignature": True, "requireActualSubkeyBinding": True, "requireSigningCapability": True, "rejectExpiredRevokedDisabledInvalid": True, "rejectUnsafeClock": True, "allowedSignatureHashIds": ["8", "9", "10", "11", "12", "14"]}), "CONFIG_KEY_POLICY")
    fs = {"freshPrivateRootMode": "0700", "rejectAbsoluteTraversalControls": True, "rejectCanonicalDuplicates": True, "rejectHardlinksSpecialFiles": True, "containedAuthenticatedRelativeLinksOnly": True, "rejectDanglingLinks": True, "rejectFinalSymlinkWrites": True, "directoryRelativeNoFollow": True, "trustedParents": True, "allowRootOwnedStickyTmpAncestorOnly": True, "expectedOwnership": "current-effective-uid", "normalisePrivilegeBits": True, "verifyCompleteInputDerivedTree": True, "persistentExtractedCache": False}
    require(m["filesystemPolicy"] == fs and all(type(m["filesystemPolicy"][k]) is type(v) for k, v in fs.items()), "CONFIG_FILESYSTEM_POLICY")
    r = m["runtime"]
    keys(r, {"platform", "ciOs", "localInspectionOs", "consumers", "subtree", "executable", "interpreter", "requiredSonames", "trustedOsLibraryRoots", "forbiddenLoaderEnvironment", "excludedMembers", "optionalElfMembers", "setuidNormalisation", "expectedMembers", "limits", "inventoryBinding"}, "CONFIG_RUNTIME_SCHEMA")
    for name, expected in {"platform": "linux-x64-glibc", "ciOs": "ubuntu-24.04", "localInspectionOs": "debian-12", "consumers": ["puppeteer", "lighthouse"], "subtree": "opt/google/chrome", "executable": "opt/google/chrome/chrome", "interpreter": "/lib64/ld-linux-x86-64.so.2", "trustedOsLibraryRoots": ["/usr/lib", "/usr/lib64", "/lib", "/lib64"], "forbiddenLoaderEnvironment": ["LD_PRELOAD", "LD_LIBRARY_PATH", "LD_AUDIT"], "excludedMembers": ["opt/google/chrome/cron", "opt/google/chrome/cron/google-chrome", "opt/google/chrome/google-chrome", "opt/google/chrome/apparmor.d", "opt/google/chrome/apparmor.d/google-chrome-stable"], "optionalElfMembers": ["opt/google/chrome/libqt5_shim.so", "opt/google/chrome/libqt6_shim.so"], "setuidNormalisation": ["opt/google/chrome/chrome-sandbox"]}.items():
        require(r[name] == expected, "CONFIG_RUNTIME_POLICY")
    limits = {"members": 12000, "expandedRegularBytes": 1500000000, "elfMemberBytes": 1073741824, "wallSeconds": 120, "rawBytes": 143638568}
    require(r["limits"] == limits and all(type(r["limits"][k]) is int for k in limits), "CONFIG_LIMITS")
    binding = {"rawSha256": source["sha256"], "packageMemberCount": 289, "subtreeMemberCount": 264, "selectedMemberCount": 259, "selectedRegularBytes": 461997914, "inspectionInventorySha256": "430c56e2b5332216df99b0ed92959d8e3923e9b643463613718ed068201a8174"}
    require(r["inventoryBinding"] == binding and all(type(r["inventoryBinding"][k]) is type(v) for k, v in binding.items()), "CONFIG_INVENTORY_BINDING")
    require(type(r["expectedMembers"]) is list and len(r["expectedMembers"]) == 259, "CONFIG_INVENTORY_COUNT")
    seen = set()
    total = 0
    elf_needed = set()
    for member in r["expectedMembers"]:
        require(type(member) is dict, "CONFIG_MEMBER_SCHEMA")
        expected_keys = {"path", "type", "bytes", "inputMode", "linkTarget", "uid", "gid", "normalisedMode"}
        if member.get("type") == "0":
            expected_keys.add("sha256")
        if "elf" in member:
            expected_keys.add("elf")
        keys(member, expected_keys, "CONFIG_MEMBER_SCHEMA")
        path = canonical_member(member["path"])
        require(path == member["path"] and (path == r["subtree"] or path.startswith(r["subtree"] + "/")) and path not in seen and path not in r["excludedMembers"], "CONFIG_MEMBER_PATH")
        seen.add(path)
        require(member["type"] in ("0", "2", "5") and integer(member["bytes"]) and type(member["uid"]) is int and member["uid"] == 0 and type(member["gid"]) is int and member["gid"] == 0, "CONFIG_MEMBER_IDENTITY")
        require(type(member["inputMode"]) is str and re.fullmatch(r"0o[0-7]{3,4}", member["inputMode"]) and type(member["normalisedMode"]) is str and re.fullmatch(r"0o[0-7]{3}", member["normalisedMode"]), "CONFIG_MEMBER_MODE")
        mode = int(member["inputMode"], 8)
        require(int(member["normalisedMode"], 8) == mode & 0o777 and (not mode & 0o7000 or path in r["setuidNormalisation"]) and (member["type"] == "2" or not mode & 0o022), "CONFIG_MEMBER_MODE")
        require(type(member["linkTarget"]) is str and (member["type"] == "2" or member["linkTarget"] == ""), "CONFIG_MEMBER_LINK")
        if member["type"] == "0":
            require(type(member["sha256"]) is str and HASH.fullmatch(member["sha256"]), "CONFIG_MEMBER_DIGEST")
            total += member["bytes"]
        else:
            require(member["bytes"] == 0, "CONFIG_MEMBER_SIZE")
        if "elf" in member:
            validate_elf_evidence(member["elf"])
            if path not in r["optionalElfMembers"]:
                elf_needed.update(member["elf"]["needed"])
    require(total == binding["selectedRegularBytes"] and r["executable"] in seen, "CONFIG_INVENTORY_BINDING")
    expected = {row["path"]: row for row in r["expectedMembers"]}
    for member in r["expectedMembers"]:
        for parent in parent_members(member["path"], r["subtree"]):
            require(parent in expected and expected[parent]["type"] == "5", "CONFIG_DIRECTORY_COVERAGE")
        if member["type"] == "2":
            validate_link_chain(member["path"], expected, r["subtree"])
    require(type(r["requiredSonames"]) is list and len(r["requiredSonames"]) == len(set(r["requiredSonames"])) and set(r["requiredSonames"]) == elf_needed, "CONFIG_SONAMES")
    require(expected[r["executable"]].get("elf", {}).get("interpreter") == r["interpreter"] and int(expected[r["executable"]]["normalisedMode"], 8) & 0o111, "CONFIG_EXECUTABLE")
    return m


def validate_elf_evidence(value):
    keys(value, {"class", "endianness", "machine", "interpreter", "needed", "searchPaths"}, "ELF_EVIDENCE_SCHEMA")
    require(type(value["class"]) is int and value["class"] == 2 and type(value["endianness"]) is int and value["endianness"] == 1 and type(value["machine"]) is int and value["machine"] == 62, "ELF_ARCHITECTURE")
    require(value["interpreter"] is None or value["interpreter"] == "/lib64/ld-linux-x86-64.so.2", "ELF_INTERPRETER")
    require(type(value["needed"]) is list and value["needed"] and all(type(v) is str and SONAME.fullmatch(v) for v in value["needed"]) and len(value["needed"]) == len(set(value["needed"])), "ELF_NEEDED")
    require(value["searchPaths"] == [], "ELF_SEARCH_PATH")


def capabilities():
    require(sys.platform == "linux" and hasattr(os, "geteuid") and hasattr(os, "O_NOFOLLOW") and hasattr(os, "O_DIRECTORY") and os.open in os.supports_dir_fd and os.stat in os.supports_dir_fd and os.readlink in os.supports_dir_fd and os.mkdir in os.supports_dir_fd and os.symlink in os.supports_dir_fd and os.stat in os.supports_follow_symlinks and hasattr(tarfile, "data_filter"), "LINUX_NOFOLLOW_CAPABILITY_REQUIRED")


def check_directory_stat(info, path, private=False, os_owned=False):
    require(stat.S_ISDIR(info.st_mode), "FILESYSTEM_PARENT_TYPE")
    require(info.st_uid in ({0} if os_owned else {0, os.geteuid()}), "FILESYSTEM_PARENT_OWNER")
    sticky_tmp = path == "/tmp" and info.st_uid == 0 and info.st_mode & stat.S_ISVTX
    require(not info.st_mode & 0o022 or sticky_tmp, "FILESYSTEM_PARENT_WRITABLE")
    if private:
        require(info.st_uid == os.geteuid() and stat.S_IMODE(info.st_mode) == 0o700, "FILESYSTEM_PRIVATE_ROOT")


@contextlib.contextmanager
def directory(path, private=False, os_owned=False):
    require(type(path) is str and path.startswith("/") and posixpath.normpath(path) == path and "//" not in path and not re.search(r"[\x00-\x1f\x7f]", path), "FILESYSTEM_ABSOLUTE_CANONICAL")
    fd = os.open("/", os.O_RDONLY | os.O_DIRECTORY | os.O_NOFOLLOW)
    try:
        current = ""
        check_directory_stat(os.fstat(fd), "/", os_owned=os_owned)
        for part in path.split("/")[1:]:
            if not part:
                continue
            current += "/" + part
            child = os.open(part, os.O_RDONLY | os.O_DIRECTORY | os.O_NOFOLLOW, dir_fd=fd)
            os.close(fd)
            fd = child
            check_directory_stat(os.fstat(fd), current, os_owned=os_owned)
        check_directory_stat(os.fstat(fd), path, private=private, os_owned=os_owned)
        yield fd
    except OSError:
        raise Rejected("FILESYSTEM_NOFOLLOW_DIRECTORY") from None
    finally:
        os.close(fd)


def stat_identity(info):
    return (info.st_dev, info.st_ino, info.st_size, info.st_mtime_ns, info.st_ctime_ns, info.st_mode, info.st_uid, info.st_gid, info.st_nlink)


def stable_identity(before, after, current):
    require(stat_identity(before) == stat_identity(after) == stat_identity(current), "FILESYSTEM_INPUT_REPLACED")


def check_file_stat(info, private=False, os_owned=False):
    require(stat.S_ISREG(info.st_mode), "FILESYSTEM_REGULAR_REQUIRED")
    require(info.st_uid in ({0} if os_owned else {0, os.geteuid()}) and not info.st_mode & 0o022, "FILESYSTEM_FILE_OWNER_MODE")
    if private:
        require(info.st_uid == os.geteuid() and stat.S_IMODE(info.st_mode) == 0o600 and info.st_nlink == 1, "RAW_PRIVATE_FILE")


@contextlib.contextmanager
def opened(path, private=False, os_owned=False):
    with directory(posixpath.dirname(path), private=private, os_owned=os_owned) as parent:
        try:
            fd = os.open(posixpath.basename(path), os.O_RDONLY | os.O_NOFOLLOW | os.O_NONBLOCK, dir_fd=parent)
        except OSError:
            raise Rejected("FILESYSTEM_NOFOLLOW_FILE") from None
        try:
            before = os.fstat(fd)
            check_file_stat(before, private, os_owned)
            yield fd, before
            after = os.fstat(fd)
            current = os.stat(posixpath.basename(path), dir_fd=parent, follow_symlinks=False)
            stable_identity(before, after, current)
        finally:
            os.close(fd)


def read_fd(fd, maximum):
    result = bytearray()
    os.lseek(fd, 0, os.SEEK_SET)
    while True:
        block = os.read(fd, min(1024 * 1024, maximum + 1 - len(result)))
        if not block:
            return bytes(result)
        result.extend(block)
        require(len(result) <= maximum, "RESOURCE_READ_LIMIT")


def hash_fd(fd, expected_bytes=None, expected_hash=None):
    os.lseek(fd, 0, os.SEEK_SET)
    hasher = hashlib.sha256()
    length = 0
    while True:
        block = os.read(fd, 1024 * 1024)
        if not block:
            break
        length += len(block)
        require(expected_bytes is None or length <= expected_bytes, "RAW_LENGTH")
        hasher.update(block)
    require(expected_bytes is None or length == expected_bytes, "RAW_LENGTH")
    value = hasher.hexdigest()
    require(expected_hash is None or value == expected_hash, "RAW_DIGEST")
    return length, value


def verify_bytes(data, size, expected_hash, code):
    require(len(data) == size and digest(data) == expected_hash, code)


def trusted_tool(name):
    path = os.path.realpath("/usr/bin/" + name)
    require(path.startswith("/usr/bin/") and name in {"gpg", "gpgv", "dpkg-deb", "dpkg-query"}, "TRUSTED_TOOL_PATH")
    with opened(path, os_owned=True) as (fd, info):
        require(info.st_mode & 0o111, "TRUSTED_TOOL_EXECUTABLE")
    return path


def clean_environment(environment):
    require(not any(value and (re.match(r"^(?:LD_|GLIBC_TUNABLES$|GCONV_PATH$|LOCPATH$|NODE_OPTIONS$|GNUPGHOME$)", key) or re.fullmatch(r"(?:PYTHONPATH|PYTHONHOME|PYTHONSTARTUP|PYTHONINSPECT|PYTHONBREAKPOINT|PYTHONUSERBASE|PYTHONWARNINGS|PYTHONPYCACHEPREFIX|GH_TOKEN|GITHUB_TOKEN|NPM_TOKEN|NODE_AUTH_TOKEN|NPM_AUTH_TOKEN|YARN_NPM_AUTH_TOKEN|LHCI_TOKEN|GIT_TOKEN|GIT_PASSWORD|VERCEL_TOKEN|HOSTINGER_API_KEY)", key)) for key, value in environment.items()), "RUNTIME_ENVIRONMENT_OVERRIDE")
    # Platform artifact credentials remain a runner trust boundary; no ambient variables reach child tools.
    return {"PATH": "/usr/bin:/bin", "LANG": "C", "LC_ALL": "C", "TZ": "UTC"}


def run_bounded(args, *, pass_fds=(), maximum=2 * 1024 * 1024, timeout=30, executable=None):
    deadline = min(time.monotonic() + timeout, DEADLINE if DEADLINE is not None else float("inf"))
    require(deadline > time.monotonic(), "RESOURCE_WALL_LIMIT")
    try:
        proc = subprocess.Popen(args, executable=executable, stdin=subprocess.DEVNULL, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, env=clean_environment(os.environ), pass_fds=pass_fds)
    except OSError:
        raise Rejected("TRUSTED_TOOL_UNAVAILABLE") from None
    output = bytearray()
    selector = selectors.DefaultSelector()
    selector.register(proc.stdout, selectors.EVENT_READ)
    try:
        while selector.get_map():
            remaining = deadline - time.monotonic()
            require(remaining > 0, "RESOURCE_WALL_LIMIT")
            for key, _ in selector.select(min(remaining, 1)):
                block = os.read(key.fd, min(65536, maximum + 1 - len(output)))
                if not block:
                    selector.unregister(key.fileobj)
                    continue
                output.extend(block)
                require(len(output) <= maximum, "RESOURCE_TOOL_OUTPUT_LIMIT")
        return bytes(output), proc.wait(timeout=max(0.01, deadline - time.monotonic()))
    except subprocess.TimeoutExpired:
        raise Rejected("RESOURCE_WALL_LIMIT") from None
    finally:
        selector.close()
        if proc.poll() is None:
            proc.kill()
        proc.wait()
        proc.stdout.close()


def command(args, **options):
    output, status = run_bounded(args, **options)
    require(status == 0, "TRUSTED_TOOL_FAILED_OR_OUTPUT_LIMIT")
    return output


def parse_key_status(text, p, now):
    require(integer(now, 1), "KEY_CLOCK")
    release = int(email.utils.parsedate_to_datetime(p["signedReleaseDate"]).timestamp())
    require(release <= now < p["signerExpiresUnix"], "KEY_CLOCK")
    records = []
    current = None
    for line in text.splitlines():
        fields = line.split(":")
        if fields[0] in ("pub", "sub"):
            require(len(fields) >= 12, "KEY_STATUS_MALFORMED")
            current = {"kind": fields[0], "fields": fields, "fpr": None, "sigs": []}
            records.append(current)
        elif fields[0] == "fpr" and current is not None:
            require(len(fields) > 9 and FINGERPRINT.fullmatch(fields[9]) and current["fpr"] is None, "KEY_FINGERPRINT_MALFORMED")
            current["fpr"] = fields[9]
        elif fields[0] == "sig" and current is not None:
            current["sigs"].append(fields)
    primary_records = [r for r in records if r["kind"] == "pub" and r["fpr"] == p["primaryFingerprint"]]
    signer_records = [r for r in records if r["kind"] == "sub" and r["fpr"] == p["signerFingerprint"]]
    require(len(primary_records) == len(signer_records) == 1, "KEY_SIGNING_IDENTITY")
    primary, signer = primary_records[0], signer_records[0]
    require(records.index(primary) < records.index(signer) and not any(r["kind"] == "pub" for r in records[records.index(primary) + 1:records.index(signer)]), "KEY_SUBKEY_PARENT")
    for record in (primary, signer):
        fields = record["fields"]
        require(fields[1] in ("-", "q", "n", "m", "f", "u", "o") and "D" not in fields[11] and fields[4] == record["fpr"][-16:], "KEY_UNUSABLE_STATUS")
        require(fields[5].isdigit() and int(fields[5]) <= release and (fields[6] == "" or fields[6].isdigit() and int(fields[6]) > now), "KEY_LIFETIME")
    require(signer["fields"][5] == str(p["signerCreatedUnix"]) and signer["fields"][6] == str(p["signerExpiresUnix"]) and "s" in signer["fields"][11], "KEY_SIGNING_CAPABILITY")
    for record, classes in ((primary, {"10", "11", "12", "13", "1f"}), (signer, {"18"})):
        valid = [sig for sig in record["sigs"] if len(sig) > 10 and sig[1] == "!" and sig[4] == p["primaryFingerprint"][-16:] and sig[10][:2].lower() in classes and sig[5].isdigit() and int(sig[5]) <= release and (not sig[6] or sig[6].isdigit() and int(sig[6]) > now)]
        require(bool(valid), "KEY_SELF_SIGNATURE" if record is primary else "KEY_SUBKEY_BINDING")
    return True


def parse_signature_status(text, p, now):
    lines = [line[len("[GNUPG:] "):].split() for line in text.splitlines() if line.startswith("[GNUPG:] ")]
    require(lines and not any(row and row[0] in {"BADSIG", "ERRSIG", "NO_PUBKEY", "NODATA", "FAILURE", "ERROR", "EXPSIG", "EXPKEYSIG", "REVKEYSIG", "KEYEXPIRED", "SIGEXPIRED"} for row in lines), "SIGNATURE_INVALID")
    valid = [row for row in lines if row and row[0] == "VALIDSIG"]
    require(len(valid) == 1 and len(valid[0]) == 11, "SIGNATURE_STATUS_MISSING")
    row = valid[0]
    require(row[1] == p["signerFingerprint"] and row[10] == p["primaryFingerprint"], "SIGNATURE_SIGNING_IDENTITY")
    require(row[8] in ("8", "9", "10", "11", "12", "14") and row[5] == "4" and row[9] == "01", "SIGNATURE_ALGORITHM")
    release = int(email.utils.parsedate_to_datetime(p["signedReleaseDate"]).timestamp())
    require(row[3].isdigit() and row[4].isdigit() and release <= int(row[3]) <= now + 300 and int(row[3]) < p["signerExpiresUnix"] and (row[4] == "0" or int(row[4]) > now), "SIGNATURE_LIFETIME")
    return row[8]


def deb822(data):
    try:
        text = data.decode("utf-8")
    except UnicodeError:
        raise Rejected("METADATA_ENCODING") from None
    require("\x00" not in text and len(data) <= 2 * 1024 * 1024, "METADATA_LIMIT")
    stanzas, fields, previous = [], {}, None
    for line in text.splitlines() + [""]:
        if not line:
            if fields:
                stanzas.append(fields)
            fields, previous = {}, None
        elif line[0] in " \t":
            require(previous is not None, "METADATA_CONTINUATION")
            fields[previous] += "\n" + line[1:]
        else:
            match = re.fullmatch(r"([A-Za-z0-9-]+):[ \t]*(.*)", line)
            require(match is not None and match[1] not in fields, "METADATA_DUPLICATE_OR_MALFORMED")
            previous = match[1]
            fields[previous] = match[2]
    return stanzas


def authenticate_index(release_bytes, packages_bytes, m):
    releases = deb822(release_bytes)
    require(len(releases) == 1, "REPOSITORY_STANZA")
    release, p = releases[0], m["provenance"]
    require(all(release.get(k) == v for k, v in {"Origin": "Google LLC", "Label": "Google", "Suite": "stable", "Codename": "stable", "Date": p["signedReleaseDate"], "Components": "main"}.items()), "REPOSITORY_METADATA")
    require("amd64" in release.get("Architectures", "").split(), "REPOSITORY_ARCHITECTURE")
    entries = []
    for line in release.get("SHA256", "").splitlines():
        if not line.strip():
            continue
        match = re.fullmatch(r"\s*([0-9a-f]{64})\s+([0-9]+)\s+(\S+)\s*", line)
        require(match is not None, "REPOSITORY_INDEX_ENTRY")
        if match[3] == p["signedIndexPath"]:
            entries.append((match[1], int(match[2])))
    require(entries == [(p["packagesSha256"], p["packagesBytes"])], "REPOSITORY_INDEX_IDENTITY")
    verify_bytes(packages_bytes, p["packagesBytes"], p["packagesSha256"], "PACKAGES_IDENTITY")
    found = [row for row in deb822(packages_bytes) if row.get("Package") == m["product"]]
    require(len(found) == 1, "PACKAGE_INDEX_UNIQUE")
    row = found[0]
    require(row.get("Version") == m["packageVersion"], "PACKAGE_INDEX_VERSION")
    require(row.get("Architecture") == m["architecture"], "PACKAGE_INDEX_ARCHITECTURE")
    path = m["source"]["url"].split("/deb/", 1)[1]
    require(row.get("Filename") == path and row.get("Size") == str(m["source"]["bytes"]) and row.get("SHA256") == m["source"]["sha256"], "PACKAGE_INDEX_INPUT")
    return {"name": m["product"], "version": m["packageVersion"], "architecture": m["architecture"], "path": path, "bytes": m["source"]["bytes"], "sha256": m["source"]["sha256"]}


def authenticate(m, current_key):
    p = m["provenance"]
    material = {}
    for key, path, size, expected_hash in (("key", os.path.join(REPOSITORY, p["keyPath"]), KEY_BYTES, p["keySha256"]), ("current", current_key, KEY_BYTES, p["keySha256"]), ("release", os.path.join(REPOSITORY, p["inReleasePath"]), p["inReleaseBytes"], p["inReleaseSha256"]), ("packages", os.path.join(REPOSITORY, p["packagesPath"]), p["packagesBytes"], p["packagesSha256"])):
        with opened(path, private=key == "current") as (fd, _):
            material[key] = read_fd(fd, size)
        verify_bytes(material[key], size, expected_hash, "CURRENT_KEY_IDENTITY" if key == "current" else "PROVENANCE_INPUT_IDENTITY")
    now = int(time.time())
    gpg, gpgv = trusted_tool("gpg"), trusted_tool("gpgv")
    with tempfile.TemporaryDirectory(prefix="gs-browser-key-") as scratch:
        os.chmod(scratch, 0o700)
        with directory(scratch, private=True):
            pass
        for name, data in (("key.asc", material["key"]), ("release", material["release"])):
            fd = os.open(os.path.join(scratch, name), os.O_WRONLY | os.O_CREAT | os.O_EXCL | os.O_NOFOLLOW, 0o600)
            with os.fdopen(fd, "wb") as out:
                out.write(data)
        base = [gpg, "--no-options", "--homedir", scratch, "--batch", "--no-auto-check-trustdb", "--auto-key-locate", "clear"]
        command(base + ["--import", os.path.join(scratch, "key.asc")])
        status = command(base + ["--with-colons", "--with-fingerprint", "--with-subkey-fingerprint", "--check-sigs", p["primaryFingerprint"]]).decode("ascii")
        parse_key_status(status, p, now)
        exported = command(base + ["--export", p["primaryFingerprint"]])
        require(exported, "KEYRING_EMPTY")
        keyring = os.path.join(scratch, "trusted.gpg")
        with open(keyring, "xb") as out:
            out.write(exported)
        plaintext = os.path.join(scratch, "plaintext")
        sig = command([gpgv, "--homedir", scratch, "--keyring", keyring, "--status-fd", "1", "--output", plaintext, os.path.join(scratch, "release")]).decode("ascii")
        hash_id = parse_signature_status(sig, p, now)
        with opened(plaintext) as (fd, _):
            release = read_fd(fd, 1024 * 1024)
        package = authenticate_index(release, material["packages"], m)
    return {"keySha256": p["keySha256"], "inReleaseSha256": p["inReleaseSha256"], "packagesSha256": p["packagesSha256"], "primaryFingerprint": p["primaryFingerprint"], "signerFingerprint": p["signerFingerprint"], "signedReleaseDate": p["signedReleaseDate"], "package": package, "signatureHashId": hash_id, "checkedAtUnix": now, "signatureVerified": True, "keyStatusVerified": True}


def validate_deb(file, length):
    file.seek(0)
    require(file.read(8) == b"!<arch>\n", "DEB_MAGIC")
    members = []
    while file.tell() < length:
        header = file.read(60)
        require(len(header) == 60 and header[58:] == b"`\n", "DEB_TRUNCATED_HEADER")
        try:
            name = header[:16].decode("ascii").strip().rstrip("/")
            size_text = header[48:58].decode("ascii").strip()
            require(re.fullmatch(r"[0-9]+", size_text) is not None, "DEB_MEMBER_SIZE")
            size = int(size_text)
        except UnicodeError:
            raise Rejected("DEB_MEMBER_HEADER") from None
        require(name not in [row[0] for row in members] and len(members) < 3 and size <= length - file.tell(), "DEB_MEMBER_BOUNDS_OR_DUPLICATE")
        offset = file.tell()
        members.append((name, offset, size))
        file.seek(size, 1)
        if size % 2:
            require(file.read(1) == b"\n", "DEB_PADDING")
    require(file.tell() == length and len(members) == 3 and members[0][0] == "debian-binary" and members[1][0] in ("control.tar.xz", "control.tar.gz", "control.tar.zst") and members[2][0] in ("data.tar.xz", "data.tar.gz", "data.tar.zst"), "DEB_MEMBER_LAYOUT")
    file.seek(members[0][1])
    require(members[0][2] == 4 and file.read(4) == b"2.0\n", "DEB_VERSION")
    return members


def stream_tool(args, raw_fd, limit, deadline, target):
    try:
        proc = subprocess.Popen(args, stdin=subprocess.DEVNULL, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, pass_fds=(raw_fd,), env=clean_environment(os.environ))
    except OSError:
        raise Rejected("DEB_TOOL_UNAVAILABLE") from None
    selector = selectors.DefaultSelector()
    selector.register(proc.stdout, selectors.EVENT_READ)
    total = 0
    try:
        while selector.get_map():
            remaining = deadline - time.monotonic()
            require(remaining > 0, "RESOURCE_WALL_LIMIT")
            for key, _ in selector.select(min(remaining, 1)):
                block = os.read(key.fd, 1024 * 1024)
                if not block:
                    selector.unregister(key.fileobj)
                    continue
                total += len(block)
                require(total <= limit, "RESOURCE_EXPANDED_LIMIT")
                target.write(block)
        require(proc.wait(timeout=max(0.01, deadline - time.monotonic())) == 0, "DEB_STREAM_FAILED")
        target.seek(0)
    except subprocess.TimeoutExpired:
        raise Rejected("RESOURCE_WALL_LIMIT") from None
    finally:
        selector.close()
        if proc.poll() is None:
            proc.kill()
        proc.wait()
        proc.stdout.close()


def tar_framing(file, max_members, max_bytes):
    """Bound headers before tarfile can allocate extended-header or sparse data."""
    file.seek(0)
    count, total = 0, 0
    while True:
        header = file.read(512)
        require(len(header) == 512, "ARCHIVE_TRUNCATED_HEADER")
        if header == bytes(512):
            tail = file.read(1024 * 1024 + 1)
            require(512 <= len(tail) <= 1024 * 1024 and len(tail) % 512 == 0 and not any(tail), "ARCHIVE_END_MARKER")
            break
        count += 1
        require(count <= max_members, "RESOURCE_MEMBER_LIMIT")
        require(header[156:157] != b"1", "ARCHIVE_HARDLINK")
        require(header[156:157] in (b"0", b"\x00", b"2", b"5"), "ARCHIVE_MEMBER_TYPE")
        number = header[124:136].rstrip(b"\x00 ").lstrip(b" ")
        require(bool(re.fullmatch(b"[0-7]+", number)), "ARCHIVE_SIZE_ENCODING")
        size = int(number, 8)
        require(header[156:157] in (b"0", b"\x00") or size == 0, "ARCHIVE_MEMBER_SIZE")
        total += size
        require(total <= max_bytes, "RESOURCE_EXPANDED_LIMIT")
        file.seek(((size + 511) // 512) * 512, 1)
    file.seek(0)


def control_identity(file, m):
    tar_framing(file, 128, 8 * 1024 * 1024)
    found, seen, count, expanded = [], set(), 0, 0
    try:
        with tarfile.open(fileobj=file, mode="r:") as archive:
            for member in archive:
                count += 1
                require(count <= 128, "CONTROL_MEMBER_LIMIT")
                path = canonical_member(member.name, True)
                require(path not in seen, "CONTROL_DUPLICATE")
                seen.add(path)
                require(member.isdir() or member.isreg(), "CONTROL_MEMBER_TYPE")
                require(member.size >= 0, "CONTROL_MEMBER_SIZE")
                expanded += member.size
                require(expanded <= 8 * 1024 * 1024, "CONTROL_EXPANDED_LIMIT")
                if path == "control":
                    require(member.isreg() and member.size <= 1024 * 1024, "CONTROL_IDENTITY_TYPE")
                    found.extend(deb822(archive.extractfile(member).read()))
    except (tarfile.TarError, EOFError, OSError):
        raise Rejected("CONTROL_ARCHIVE_MALFORMED") from None
    require(len(found) == 1, "CONTROL_IDENTITY_MISSING")
    for key, expected, code in (("Package", m["product"], "CONTROL_PACKAGE"), ("Version", m["packageVersion"], "CONTROL_VERSION"), ("Architecture", m["architecture"], "CONTROL_ARCHITECTURE")):
        require(found[0].get(key) == expected, code)


def read_at(file, offset, count, length):
    require(integer(offset) and integer(count) and offset <= length and count <= length - offset, "ELF_BOUNDS")
    file.seek(offset)
    data = file.read(count)
    require(len(data) == count, "ELF_TRUNCATED")
    return data


def elf_identity(file, length):
    header = read_at(file, 0, 64, length)
    require(header[:4] == b"\x7fELF", "ELF_MAGIC")
    require(header[4:7] == b"\x02\x01\x01", "ELF_ARCHITECTURE")
    fields = struct.unpack("<16sHHIQQQIHHHHHH", header)
    require(fields[1] in (2, 3) and fields[2] == 62 and fields[3] == 1 and fields[8] == 64 and fields[9] == 56 and 0 < fields[10] <= 1024, "ELF_HEADER")
    segments, interpreter, dynamic = [], None, None
    for index in range(fields[10]):
        ph = struct.unpack("<IIQQQQQQ", read_at(file, fields[5] + index * 56, 56, length))
        kind, _, offset, address, _, filesz, memsz, _ = ph
        require(offset <= length and filesz <= length - offset and filesz <= memsz, "ELF_SEGMENT_BOUNDS")
        if kind == 1:
            segments.append((address, offset, filesz))
        elif kind == 3:
            require(interpreter is None and 1 < filesz <= 4096, "ELF_INTERPRETER")
            value = read_at(file, offset, filesz, length)
            require(value.endswith(b"\x00") and b"\x00" not in value[:-1], "ELF_INTERPRETER")
            try:
                interpreter = value[:-1].decode("ascii")
            except UnicodeError:
                raise Rejected("ELF_INTERPRETER") from None
        elif kind == 2:
            require(dynamic is None and filesz % 16 == 0 and filesz <= 65536, "ELF_DYNAMIC")
            dynamic = (offset, filesz)
    require(dynamic is not None, "ELF_DYNAMIC_MISSING")
    tags, terminated = {}, False
    for offset in range(dynamic[0], dynamic[0] + dynamic[1], 16):
        tag, value = struct.unpack("<qQ", read_at(file, offset, 16, length))
        if tag == 0:
            terminated = True
            break
        tags.setdefault(tag, []).append(value)
    require(terminated and len(tags.get(5, [])) == len(tags.get(10, [])) == 1 and 0 < tags[10][0] <= 1024 * 1024, "ELF_STRTAB")
    address, size = tags[5][0], tags[10][0]
    mappings = [(off + address - addr) for addr, off, count in segments if addr <= address and address - addr <= count and size <= count - (address - addr)]
    require(len(mappings) == 1, "ELF_STRTAB_MAPPING")
    strings = read_at(file, mappings[0], size, length)

    def string(index):
        require(index < len(strings) and strings.find(b"\x00", index) >= index, "ELF_STRING_BOUNDS")
        try:
            return strings[index:strings.index(b"\x00", index)].decode("ascii")
        except UnicodeError:
            raise Rejected("ELF_STRING_ENCODING") from None

    result = {"class": 2, "endianness": 1, "machine": 62, "interpreter": interpreter, "needed": [string(index) for index in tags.get(1, [])], "searchPaths": [string(index) for tag in (15, 29) for index in tags.get(tag, [])]}
    validate_elf_evidence(result)
    return result


def parent_members(path, subtree):
    result = []
    parent = posixpath.dirname(path)
    while parent == subtree or parent.startswith(subtree + "/"):
        result.append(parent)
        parent = posixpath.dirname(parent)
    return result


def validate_link_chain(path, members, subtree):
    seen = set()
    while members[path]["type"] == "2":
        require(path not in seen, "ARCHIVE_LINK_CYCLE")
        seen.add(path)
        path = contained_link(path, members[path]["linkTarget"], subtree)
        require(path in members, "ARCHIVE_LINK_DANGLING")
        for parent in parent_members(path, subtree):
            require(parent in members and members[parent]["type"] == "5", "ARCHIVE_LINK_PARENT")
    return path


def normalised_inventory(rows):
    return [{key: row[key] for key in ("path", "type", "bytes", "normalisedMode", "linkTarget", "sha256", "elf") if key in row} for row in rows]


def archive_inventory(file, runtime, write=None, deadline=None):
    tar_framing(file, runtime["limits"]["members"], runtime["limits"]["expandedRegularBytes"])
    expected = {row["path"]: row for row in runtime["expectedMembers"]}
    seen, selected, count, subtree_count, expanded = set(), {}, 0, 0, 0
    try:
        with tarfile.open(fileobj=file, mode="r:") as archive:
            for member in archive:
                require(deadline is None or time.monotonic() < deadline, "RESOURCE_WALL_LIMIT")
                count += 1
                require(count <= runtime["limits"]["members"], "RESOURCE_MEMBER_LIMIT")
                path = canonical_member(member.name, True)
                require(path not in seen, "ARCHIVE_CANONICAL_DUPLICATE")
                seen.add(path)
                require(not member.islnk(), "ARCHIVE_HARDLINK")
                require(member.isreg() or member.isdir() or member.issym(), "ARCHIVE_MEMBER_TYPE")
                require(member.size >= 0, "ARCHIVE_MEMBER_SIZE")
                if member.isreg():
                    expanded += member.size
                    require(expanded <= runtime["limits"]["expandedRegularBytes"], "RESOURCE_EXPANDED_LIMIT")
                inside = path == runtime["subtree"] or path.startswith(runtime["subtree"] + "/")
                if not inside:
                    continue
                subtree_count += 1
                if path in runtime["excludedMembers"]:
                    continue
                require(path in expected, "ARCHIVE_UNEXPECTED_MEMBER")
                require(not member.pax_headers, "ARCHIVE_PAX_OVERRIDE")
                row = {"path": path, "type": "0" if member.isreg() else "5" if member.isdir() else "2", "bytes": member.size, "inputMode": oct(member.mode), "linkTarget": member.linkname, "uid": member.uid, "gid": member.gid, "normalisedMode": oct(member.mode & 0o777)}
                require((member.issym() or not member.mode & 0o022) and (not member.mode & 0o7000 or path in runtime["setuidNormalisation"]), "ARCHIVE_PRIVILEGED_MODE")
                if member.issym():
                    contained_link(path, member.linkname, runtime["subtree"])
                content = archive.extractfile(member) if member.isreg() else None
                if content is not None:
                    hasher, length = hashlib.sha256(), 0
                    while True:
                        block = content.read(1024 * 1024)
                        if not block:
                            break
                        hasher.update(block)
                        length += len(block)
                    require(length == member.size, "ARCHIVE_TRUNCATED_FILE")
                    row["sha256"] = hasher.hexdigest()
                    if expected[path].get("elf") is not None:
                        require(member.size <= runtime["limits"]["elfMemberBytes"], "RESOURCE_ELF_LIMIT")
                        row["elf"] = elf_identity(content, member.size)
                    else:
                        content.seek(0)
                        require(content.read(4) != b"\x7fELF", "ARCHIVE_UNEXPECTED_ELF")
                require(row == expected[path], "ARCHIVE_MEMBER_IDENTITY")
                selected[path] = row
                # Explicit filter is additional protection; anchored writes below do not use extract().
                try:
                    tarfile.data_filter(member, "/gs-browser-filter-root")
                except (tarfile.FilterError, OSError):
                    raise Rejected("ARCHIVE_DATA_FILTER") from None
                if write is not None:
                    if content is not None:
                        content.seek(0)
                    write(row, content)
    except (tarfile.TarError, EOFError, OSError, ValueError):
        raise Rejected("ARCHIVE_MALFORMED_OR_TRUNCATED") from None
    require(set(selected) == set(expected), "ARCHIVE_INVENTORY_MEMBERSHIP")
    for path, row in selected.items():
        for parent in parent_members(path, runtime["subtree"]):
            require(parent in selected and selected[parent]["type"] == "5", "ARCHIVE_DIRECTORY_COVERAGE")
        if row["type"] == "2":
            validate_link_chain(path, selected, runtime["subtree"])
    rows = [selected[path] for path in sorted(selected)]
    binding = runtime["inventoryBinding"]
    require(count == binding["packageMemberCount"] and subtree_count == binding["subtreeMemberCount"] and len(rows) == binding["selectedMemberCount"] and sum(row["bytes"] for row in rows if row["type"] == "0") == binding["selectedRegularBytes"], "ARCHIVE_INVENTORY_BINDING")
    return rows, {"packageMemberCount": count, "subtreeMemberCount": subtree_count, "selectedMemberCount": len(rows), "selectedRegularBytes": binding["selectedRegularBytes"], "inputInventorySha256": digest(canonical_json(rows))}


class OutputTree:
    def __init__(self, root, create=False):
        self.root = root
        if create:
            with directory(posixpath.dirname(root), private=True) as parent:
                try:
                    os.mkdir(posixpath.basename(root), 0o700, dir_fd=parent)
                except OSError:
                    raise Rejected("FILESYSTEM_FRESH_ROOT_REQUIRED") from None
        self.context = directory(root, private=True)
        self.fd = self.context.__enter__()

    def close(self):
        self.context.__exit__(None, None, None)

    @contextlib.contextmanager
    def parent(self, path, create=False):
        parts = canonical_member(path).split("/")
        fd = os.dup(self.fd)
        try:
            for part in parts[:-1]:
                if create:
                    try:
                        os.mkdir(part, 0o755, dir_fd=fd)
                        created = True
                    except FileExistsError:
                        created = False
                child = os.open(part, os.O_RDONLY | os.O_DIRECTORY | os.O_NOFOLLOW, dir_fd=fd)
                if create and created:
                    os.fchmod(child, 0o755)
                os.close(fd)
                fd = child
                info = os.fstat(fd)
                require(info.st_uid == os.geteuid() and stat.S_IMODE(info.st_mode) == 0o755, "FILESYSTEM_TREE_PARENT_MODE")
            yield fd, parts[-1]
        except OSError:
            raise Rejected("FILESYSTEM_NOFOLLOW_TREE") from None
        finally:
            os.close(fd)

    def write(self, row, content):
        with self.parent(row["path"], True) as (parent, leaf):
            mode = int(row["normalisedMode"], 8)
            if row["type"] == "5":
                try:
                    os.mkdir(leaf, mode, dir_fd=parent)
                    child = os.open(leaf, os.O_RDONLY | os.O_DIRECTORY | os.O_NOFOLLOW, dir_fd=parent)
                    try:
                        os.fchmod(child, mode)
                    finally:
                        os.close(child)
                except FileExistsError:
                    info = os.stat(leaf, dir_fd=parent, follow_symlinks=False)
                    require(stat.S_ISDIR(info.st_mode) and info.st_uid == os.geteuid() and stat.S_IMODE(info.st_mode) == mode, "FILESYSTEM_DIRECTORY_COLLISION")
            elif row["type"] == "2":
                try:
                    os.symlink(row["linkTarget"], leaf, dir_fd=parent)
                except OSError:
                    raise Rejected("FILESYSTEM_LINK_COLLISION") from None
            else:
                try:
                    fd = os.open(leaf, os.O_WRONLY | os.O_CREAT | os.O_EXCL | os.O_NOFOLLOW, 0o600, dir_fd=parent)
                except OSError:
                    raise Rejected("FILESYSTEM_FINAL_SYMLINK_OR_COLLISION") from None
                with os.fdopen(fd, "wb") as out:
                    while True:
                        block = content.read(1024 * 1024)
                        if not block:
                            break
                        out.write(block)
                    out.flush()
                    os.fchmod(out.fileno(), mode)

    def verify(self, expected):
        actual = {}

        def visit(fd, prefix):
            for name in os.listdir(fd):
                path = prefix + name
                require(path in expected, "FILESYSTEM_OUTPUT_INVENTORY")
                row = expected[path]
                info = os.stat(name, dir_fd=fd, follow_symlinks=False)
                require(info.st_uid == os.geteuid() and info.st_gid == os.getegid(), "FILESYSTEM_OUTPUT_OWNER")
                kind = "0" if stat.S_ISREG(info.st_mode) else "5" if stat.S_ISDIR(info.st_mode) else "2" if stat.S_ISLNK(info.st_mode) else "special"
                require(kind == row["type"], "FILESYSTEM_OUTPUT_TYPE")
                actual_row = {key: row[key] for key in ("path", "type", "bytes", "normalisedMode", "linkTarget")}
                if kind == "2":
                    require(os.readlink(name, dir_fd=fd) == row["linkTarget"], "FILESYSTEM_OUTPUT_LINK")
                else:
                    require(stat.S_IMODE(info.st_mode) == int(row["normalisedMode"], 8), "FILESYSTEM_OUTPUT_MODE")
                    opened_fd = os.open(name, os.O_RDONLY | os.O_NOFOLLOW | (os.O_DIRECTORY if kind == "5" else os.O_NONBLOCK), dir_fd=fd)
                    try:
                        require(stat_identity(info) == stat_identity(os.fstat(opened_fd)), "FILESYSTEM_INPUT_REPLACED")
                        if kind == "5":
                            visit(opened_fd, path + "/")
                        else:
                            require(info.st_nlink == 1, "FILESYSTEM_OUTPUT_HARDLINK")
                            _, actual_row["sha256"] = hash_fd(opened_fd, row["bytes"], row["sha256"])
                            if "elf" in row:
                                with os.fdopen(os.dup(opened_fd), "rb") as stream:
                                    actual_row["elf"] = elf_identity(stream, info.st_size)
                                require(actual_row["elf"] == row["elf"], "FILESYSTEM_ELF_IDENTITY")
                        require(stat_identity(info) == stat_identity(os.fstat(opened_fd)) == stat_identity(os.stat(name, dir_fd=fd, follow_symlinks=False)), "FILESYSTEM_INPUT_REPLACED")
                    finally:
                        os.close(opened_fd)
                actual[path] = actual_row

        # Only these two package ancestor directories are created outside the selected subtree.
        augmented = {**expected}
        for path in ("opt", "opt/google"):
            augmented[path] = {"path": path, "type": "5", "bytes": 0, "normalisedMode": "0o755", "linkTarget": ""}
        expected = augmented
        visit(self.fd, "")
        require(set(actual) == set(expected), "FILESYSTEM_OUTPUT_INVENTORY")
        rows = [actual[path] for path in sorted(actual) if path not in ("opt", "opt/google")]
        require(rows == normalised_inventory([expected[path] for path in sorted(expected) if path not in ("opt", "opt/google")]), "FILESYSTEM_OUTPUT_IDENTITY")
        with directory(self.root, private=True) as root_fd:
            require(stat_identity(os.fstat(root_fd)) == stat_identity(os.fstat(self.fd)), "FILESYSTEM_ROOT_REPLACED")
        return digest(canonical_json(rows))


def trusted_os_realpath(path, roots):
    require(type(path) is str and path.startswith("/") and posixpath.normpath(path) == path and not re.search(r"[\x00-\x20\x7f]", path), "LOADER_PROVIDER_PATH")
    remaining, resolved, links = path.split("/")[1:], [], 0
    while remaining:
        leaf = remaining.pop(0)
        if leaf in ("", "."):
            continue
        if leaf == "..":
            require(bool(resolved), "LOADER_PROVIDER_PATH")
            resolved.pop()
            continue
        parent_path = "/" + "/".join(resolved)
        with directory(parent_path, os_owned=True) as parent:
            info = os.stat(leaf, dir_fd=parent, follow_symlinks=False)
            require(info.st_uid == 0 and (stat.S_ISLNK(info.st_mode) or not info.st_mode & 0o022), "LOADER_PROVIDER_OWNER_MODE")
            if stat.S_ISLNK(info.st_mode):
                links += 1
                require(links <= 40, "LOADER_PROVIDER_LINK_CYCLE")
                target = os.readlink(leaf, dir_fd=parent)
                require(not re.search(r"[\x00-\x20\x7f]", target), "LOADER_PROVIDER_PATH")
                if target.startswith("/"):
                    resolved = []
                remaining = target.split("/") + remaining
            else:
                require(not remaining or stat.S_ISDIR(info.st_mode), "LOADER_PROVIDER_PARENT")
                resolved.append(leaf)
    real = "/" + "/".join(resolved)
    require(any(real == root or real.startswith(root + "/") for root in roots), "LOADER_PROVIDER_ROOT")
    return real


def parse_loader_output(data):
    try:
        text = data.decode("ascii")
    except UnicodeError:
        raise Rejected("LOADER_OUTPUT_ENCODING") from None
    result = {}
    require("not found" not in text and len(text) <= 1024 * 1024, "LOADER_MISSING_PROVIDER")
    for line in text.splitlines():
        line = line.strip()
        if re.fullmatch(r"linux-vdso\.so\.1 \(0x[0-9a-f]+\)", line):
            continue
        match = re.fullmatch(r"([A-Za-z0-9_+.-]+) => (/[^\s]+) \(0x[0-9a-f]+\)", line)
        if match:
            name, path = match.groups()
        else:
            match = re.fullmatch(r"(/[^\s]+) \(0x[0-9a-f]+\)", line)
            require(match is not None, "LOADER_OUTPUT_MALFORMED")
            path = match[1]
            name = posixpath.basename(path)
        require(name not in result or result[name] == path, "LOADER_PROVIDER_CONFLICT")
        result[name] = path
    require(result, "LOADER_OUTPUT_EMPTY")
    return result


def package_provider(path, real):
    tool = trusted_tool("dpkg-query")
    candidates = [real, path]
    if real.startswith("/usr/lib/"):
        candidates.append(real[4:])
    owners = set()
    for candidate in dict.fromkeys(candidates):
        try:
            result = command([tool, "--search", candidate], maximum=65536).decode("ascii")
        except Rejected as error:
            if error.code == "TRUSTED_TOOL_FAILED_OR_OUTPUT_LIMIT":
                continue
            raise
        for line in result.splitlines():
            match = re.fullmatch(r"([a-z0-9][a-z0-9+.-]*(?::amd64)?): (/.+)", line)
            require(match is not None and match[2] == candidate, "LOADER_PACKAGE_OWNERSHIP")
            owners.add(match[1])
    require(len(owners) == 1, "LOADER_PACKAGE_OWNERSHIP")
    owner = owners.pop()
    row = command([tool, "--show", "--showformat=${binary:Package}\t${Version}\t${Architecture}\t${db:Status-Status}\n", owner], maximum=65536).decode("ascii").strip().split("\t")
    require(len(row) == 4 and row[0] == owner and PACKAGE.fullmatch(row[0]) and re.fullmatch(r"[0-9][A-Za-z0-9.+:~_-]*", row[1]) and row[2] == "amd64" and row[3] == "installed", "LOADER_PACKAGE_IDENTITY")
    return {"package": row[0], "version": row[1], "architecture": row[2]}


def provider(path, runtime, soname=None):
    real = trusted_os_realpath(path, runtime["trustedOsLibraryRoots"])
    with opened(real, os_owned=True) as (fd, info):
        _, sha = hash_fd(fd)
        with os.fdopen(os.dup(fd), "rb") as file:
            header = read_at(file, 0, 64, info.st_size)
            require(header[:7] == b"\x7fELF\x02\x01\x01" and struct.unpack_from("<H", header, 18)[0] == 62, "LOADER_PROVIDER_ELF")
        identity = package_provider(path, real)
    value = {"path": path, "realPath": real, "sha256": sha, **identity}
    if soname is not None:
        value = {"soname": soname, **value}
    return value


def validate_provider_receipt(loader, runtime):
    keys(loader, {"interpreter", "providers", "elfMembers", "missing", "environmentClean"}, "PROVIDER_RECEIPT_SCHEMA")
    count = sum("elf" in row for row in runtime["expectedMembers"])
    require(type(loader["elfMembers"]) is int and loader["elfMembers"] == count and loader["missing"] == [] and loader["environmentClean"] is True, "PROVIDER_RECEIPT_INCOMPLETE")
    seen = set()
    require(type(loader["providers"]) is list and 0 < len(loader["providers"]) <= 512, "PROVIDER_RECEIPT_PROVIDERS")
    for value, is_interpreter in [(loader["interpreter"], True)] + [(p, False) for p in loader["providers"]]:
        keys(value, {"path", "realPath", "sha256", "package", "version", "architecture"} | (set() if is_interpreter else {"soname"}), "PROVIDER_ENTRY_SCHEMA")
        require(type(value["sha256"]) is str and HASH.fullmatch(value["sha256"]) and type(value["package"]) is str and PACKAGE.fullmatch(value["package"]) and type(value["version"]) is str and re.fullmatch(r"[0-9][A-Za-z0-9.+:~_-]*", value["version"]) and value["architecture"] == "amd64", "PROVIDER_ENTRY_IDENTITY")
        for key in ("path", "realPath"):
            path = value[key]
            require(type(path) is str and posixpath.normpath(path) == path and any(path.startswith(root + "/") for root in runtime["trustedOsLibraryRoots"]) and not re.search(r"[\x00-\x20\x7f]", path), "PROVIDER_ENTRY_ROOT")
        if is_interpreter:
            require(value["path"] == runtime["interpreter"], "PROVIDER_INTERPRETER_IDENTITY")
        else:
            name = value["soname"]
            require(type(name) is str and SONAME.fullmatch(name) and name not in seen, "PROVIDER_DUPLICATE_SONAME")
            seen.add(name)
    require(set(runtime["requiredSonames"]) <= seen, "PROVIDER_REQUIRED_SONAME")
    matching = [p for p in loader["providers"] if p["soname"] == posixpath.basename(runtime["interpreter"])]
    require(len(matching) == 1 and {k: v for k, v in matching[0].items() if k != "soname"} == loader["interpreter"], "PROVIDER_INTERPRETER_CONFLICT")
    return loader


def verify_loader(root, runtime):
    clean_environment(os.environ)
    interpreter = provider(runtime["interpreter"], runtime)
    observed = {}
    for member in runtime["expectedMembers"]:
        if "elf" not in member or member["path"] in runtime["optionalElfMembers"]:
            continue
        output = command([interpreter["realPath"], "--list", posixpath.join(root, member["path"])], maximum=1024 * 1024)
        paths = parse_loader_output(output)
        require(set(member["elf"]["needed"]) <= set(paths), "LOADER_MEMBER_DEPENDENCIES")
        for name, path in paths.items():
            value = provider(path, runtime, name)
            require(name not in observed or observed[name] == value, "LOADER_PROVIDER_CONFLICT")
            observed[name] = value
    loader = {"interpreter": interpreter, "providers": [observed[name] for name in sorted(observed)], "elfMembers": sum("elf" in row for row in runtime["expectedMembers"]), "missing": [], "environmentClean": True}
    return validate_provider_receipt(loader, runtime)


def browser_version(output, returncode, m):
    require(type(returncode) is int and returncode == 0, "BROWSER_VERSION_EXIT")
    try:
        value = output.decode("ascii")
    except (UnicodeError, AttributeError):
        raise Rejected("BROWSER_VERSION_ENCODING") from None
    require(value in ("Google Chrome " + m["browserVersion"], "Google Chrome " + m["browserVersion"] + "\n"), "BROWSER_VERSION_IDENTITY")
    return {"product": "Google Chrome", "version": m["browserVersion"], "output": value.rstrip("\n"), "exitCode": 0}


def run_version(executable, expected_sha, m):
    with opened(executable) as (fd, info):
        require(info.st_mode & 0o111, "BROWSER_EXECUTABLE_MODE")
        _, sha = hash_fd(fd, info.st_size, expected_sha)
        # Invoke the opened, authenticated file, so a pathname replacement cannot choose another executable.
        output, status = run_bounded([executable, "--version"], executable="/proc/self/fd/" + str(fd), pass_fds=(fd,), maximum=4096, timeout=15)
        version = browser_version(output, status, m)
    return {**version, "executable": executable, "executableSha256": sha}


def runtime_platform():
    require(os.uname().machine == "x86_64" and os.confstr("CS_GNU_LIBC_VERSION").startswith("glibc "), "RUNTIME_PLATFORM")
    release_path = trusted_os_realpath("/etc/os-release", ["/etc", "/usr/lib"])
    with opened(release_path, os_owned=True) as (fd, _):
        data = read_fd(fd, 65536).decode("ascii")
    values = dict(line.split("=", 1) for line in data.splitlines() if re.match(r"^[A-Z_]+=", line))
    values = {key: value.strip('"') for key, value in values.items()}
    require((values.get("ID"), values.get("VERSION_ID")) == ("ubuntu", "24.04") or ((values.get("ID"), values.get("VERSION_ID")) == ("debian", "12") and not os.environ.get("GITHUB_ACTIONS")), "RUNTIME_OS_POLICY")


def main(argv=None):
    global DEADLINE
    parser = argparse.ArgumentParser()
    parser.add_argument("mode", choices=("authenticate", "extract", "check"))
    parser.add_argument("--manifest", required=True)
    parser.add_argument("--current-key", required=True)
    parser.add_argument("--raw")
    parser.add_argument("--root")
    args = parser.parse_args(argv)
    capabilities()
    runtime_platform()
    clean_environment(os.environ)
    require(os.path.abspath(args.manifest) == os.path.join(REPOSITORY, "config/browser-input.json"), "CONFIG_PATH")
    with opened(args.manifest) as (fd, _):
        raw_manifest = read_fd(fd, MANIFEST_BYTES)
    verify_bytes(raw_manifest, MANIFEST_BYTES, MANIFEST_SHA256, "CONFIG_FROZEN_IDENTITY")
    m = validate_manifest(parse_json(raw_manifest))
    DEADLINE = time.monotonic() + m["runtime"]["limits"]["wallSeconds"]
    receipt = {"schemaVersion": 1, "result": "PASS", "mode": args.mode, "manifestSha256": MANIFEST_SHA256, "authentication": authenticate(m, args.current_key), "raw": None, "extraction": None, "filesystem": None, "loader": None, "browser": None}
    if args.mode == "authenticate":
        require(args.raw is None and args.root is None, "AUTHENTICATE_RAW_FORBIDDEN")
        return receipt
    require(args.raw and args.root and posixpath.dirname(args.raw) == posixpath.dirname(args.root) and posixpath.basename(args.raw) == "browser.deb" and posixpath.basename(args.root) == "runtime", "RUNTIME_JOB_LAYOUT")
    runtime, deadline = m["runtime"], DEADLINE
    with opened(args.raw, private=True) as (raw_fd, raw_info):
        length, sha = hash_fd(raw_fd, m["source"]["bytes"], m["source"]["sha256"])
        require(length == raw_info.st_size, "RAW_LENGTH")
        receipt["raw"] = {"sha256": sha, "bytes": length, "stable": True}
        with os.fdopen(os.dup(raw_fd), "rb") as raw_file:
            validate_deb(raw_file, length)
        tool = trusted_tool("dpkg-deb")
        raw_path = "/proc/self/fd/" + str(raw_fd)
        with tempfile.TemporaryFile(dir=posixpath.dirname(args.raw)) as control:
            stream_tool([tool, "--ctrl-tarfile", raw_path], raw_fd, 8 * 1024 * 1024, deadline, control)
            control_identity(control, m)
        with tempfile.TemporaryFile(dir=posixpath.dirname(args.raw)) as data:
            stream_tool([tool, "--fsys-tarfile", raw_path], raw_fd, runtime["limits"]["expandedRegularBytes"] + runtime["limits"]["members"] * 8192, deadline, data)
            # Validate the complete stream before creating any selected output.
            rows, extraction = archive_inventory(data, runtime, deadline=deadline)
            tree = OutputTree(args.root, create=args.mode == "extract")
            try:
                if args.mode == "extract":
                    data.seek(0)
                    second_rows, second = archive_inventory(data, runtime, write=tree.write, deadline=deadline)
                    require(second_rows == rows and second == extraction, "ARCHIVE_STREAM_CHANGED")
                inventory_hash = tree.verify({row["path"]: row for row in rows})
                executable = posixpath.join(args.root, runtime["executable"])
                executable_hash = next(row["sha256"] for row in rows if row["path"] == runtime["executable"])
                receipt["extraction"] = extraction
                receipt["filesystem"] = {"root": args.root, "executable": executable, "executableSha256": executable_hash, "inventorySha256": inventory_hash, "memberCount": len(rows), "noFollow": True, "ownership": "current-effective-uid", "treeVerified": True}
                receipt["loader"] = verify_loader(args.root, runtime)
                receipt["browser"] = run_version(executable, executable_hash, m)
                require(tree.verify({row["path"]: row for row in rows}) == inventory_hash, "FILESYSTEM_CHANGED_AFTER_PROVIDER")
            finally:
                tree.close()
        hash_fd(raw_fd, length, sha)
    require(time.monotonic() <= deadline, "RESOURCE_WALL_LIMIT")
    return receipt


if __name__ == "__main__":
    try:
        print(json.dumps(main(), sort_keys=True, separators=(",", ":")))
    except Rejected as error:
        print(json.dumps({"schemaVersion": 1, "result": "FAIL", "error": error.code}, separators=(",", ":")))
        sys.exit(1)
    except Exception:
        # Tool or filesystem diagnostics may contain paths, environment or package-controlled text.
        print('{"schemaVersion":1,"result":"FAIL","error":"VERIFIER_UNEXPECTED_FAILURE"}')
        sys.exit(1)
