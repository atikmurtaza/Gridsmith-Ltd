#!/usr/bin/env python3
"""Deterministic fixtures only. Never read, extract or execute the real DEB.

GnuPG fixtures below are explicitly synthetic trusted-tool output: they test
the production status predicates, not a claim of cryptographic verification.
Linux-only filesystem fixtures run only when the real no-follow API exists.
"""

import copy
import hashlib
import importlib.util
import io
import json
import os
import stat
import struct
import sys
import tarfile
import tempfile
import types

HERE = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location("browser_extractor", os.path.join(HERE, "extract-verified-browser.py"))
verifier = importlib.util.module_from_spec(spec)
spec.loader.exec_module(verifier)
with open(os.path.join(HERE, "..", "config", "browser-input.json"), "rb") as source:
    manifest_bytes = source.read()
MANIFEST = verifier.parse_json(manifest_bytes)
RESULTS = []


def positive(name, predicate, operation):
    operation()
    RESULTS.append({"name": name, "result": "PASS", "reachedPredicate": predicate, "fixture": True})


def negative(name, expected, operation):
    try:
        operation()
    except verifier.Rejected as error:
        assert error.code == expected, (name, "expected", expected, "observed", error.code)
    else:
        raise AssertionError((name, "predicate did not reject", expected))
    RESULTS.append({"name": name, "result": "PASS", "reachedPredicate": expected, "fixture": True})


def changed(value, path, replacement):
    result = copy.deepcopy(value)
    target = result
    for key in path[:-1]:
        target = target[key]
    target[path[-1]] = replacement
    return result


def elf_fixture(needed=("libc.so.6", "ld-linux-x86-64.so.2"), interpreter="/lib64/ld-linux-x86-64.so.2", rpath=None):
    strings = bytearray(b"\x00")
    offsets = []
    for name in needed:
        offsets.append(len(strings))
        strings.extend(name.encode("ascii") + b"\x00")
    rpath_index = None
    if rpath is not None:
        rpath_index = len(strings)
        strings.extend(rpath.encode("ascii") + b"\x00")
    interp = interpreter.encode("ascii") + b"\x00" if interpreter else b""
    phnum = 3 if interpreter else 2
    interp_offset = 64 + phnum * 56
    dynamic_offset = (interp_offset + len(interp) + 7) // 8 * 8
    tag_count = len(offsets) + 3 + (1 if rpath is not None else 0)
    string_offset = dynamic_offset + tag_count * 16
    total = string_offset + len(strings)
    ident = b"\x7fELF\x02\x01\x01" + bytes(9)
    header = struct.pack("<16sHHIQQQIHHHHHH", ident, 3, 62, 1, 0, 64, 0, 0, 64, 56, phnum, 0, 0, 0)
    segments = [struct.pack("<IIQQQQQQ", 1, 5, 0, 0x400000, 0, total, total, 4096)]
    if interpreter:
        segments.append(struct.pack("<IIQQQQQQ", 3, 4, interp_offset, 0x400000 + interp_offset, 0, len(interp), len(interp), 1))
    segments.append(struct.pack("<IIQQQQQQ", 2, 4, dynamic_offset, 0x400000 + dynamic_offset, 0, tag_count * 16, tag_count * 16, 8))
    tags = [(1, value) for value in offsets] + [(5, 0x400000 + string_offset), (10, len(strings))]
    if rpath is not None:
        tags.append((29, rpath_index))
    tags.append((0, 0))
    result = header + b"".join(segments) + interp
    result += bytes(dynamic_offset - len(result))
    result += b"".join(struct.pack("<qQ", tag, value) for tag, value in tags)
    result += bytes(strings)
    assert len(result) == total
    return result


ELF = elf_fixture()
ELF_IDENTITY = verifier.elf_identity(io.BytesIO(ELF), len(ELF))


def member(path, data=b"", kind="0", mode=0o644, target="", elf=None):
    row = {"path": path, "type": kind, "bytes": len(data) if kind == "0" else 0, "inputMode": oct(mode), "linkTarget": target, "uid": 0, "gid": 0, "normalisedMode": oct(mode & 0o777)}
    if kind == "0":
        row["sha256"] = hashlib.sha256(data).hexdigest()
    if elf is not None:
        row["elf"] = copy.deepcopy(elf)
    return row, data


BASE = [member("opt/google/chrome", kind="5", mode=0o755), member("opt/google/chrome/chrome", ELF, mode=0o755, elf=ELF_IDENTITY), member("opt/google/chrome/resources.pak", b"synthetic resource")]


def fixture_runtime(entries=BASE):
    rows = sorted((copy.deepcopy(row) for row, _ in entries), key=lambda row: row["path"])
    runtime = copy.deepcopy(MANIFEST["runtime"])
    runtime["expectedMembers"] = rows
    runtime["requiredSonames"] = list(ELF_IDENTITY["needed"])
    runtime["inventoryBinding"] = {"rawSha256": "f" * 64, "packageMemberCount": len(rows), "subtreeMemberCount": len(rows), "selectedMemberCount": len(rows), "selectedRegularBytes": sum(row["bytes"] for row in rows if row["type"] == "0"), "inspectionInventorySha256": "a" * 64}
    return runtime


RUNTIME = fixture_runtime()


def tar_fixture(entries=BASE):
    out = io.BytesIO()
    with tarfile.open(fileobj=out, mode="w", format=tarfile.USTAR_FORMAT) as archive:
        for row, data in entries:
            info = tarfile.TarInfo(row["path"])
            info.type = row["type"].encode("ascii")
            info.mode = int(row["inputMode"], 8)
            info.uid, info.gid = row["uid"], row["gid"]
            info.linkname = row["linkTarget"]
            info.size = len(data) if row["type"] == "0" else 0
            archive.addfile(info, io.BytesIO(data) if row["type"] == "0" else None)
    return out.getvalue()


def inventory(data=None, runtime=RUNTIME):
    return verifier.archive_inventory(io.BytesIO(tar_fixture() if data is None else data), runtime)


def signature_fixture(primary=None, signer=None, status="VALIDSIG", hash_id="8"):
    p = MANIFEST["provenance"]
    return "[GNUPG:] " + status + " " + (signer or p["signerFingerprint"]) + " 2026-10-14 1791969399 0 4 0 1 " + hash_id + " 01 " + (primary or p["primaryFingerprint"]) + "\n"


def key_fixture():
    p = MANIFEST["provenance"]
    def record(kind, fpr, created, expires, caps):
        row = [kind, "-", "4096", "1", fpr[-16:], str(created), str(expires) if expires else "", "", "", "", "", caps, ""]
        return ":".join(row) + "\n" + ":".join(["fpr", "", "", "", "", "", "", "", "", fpr, ""]) + "\n"
    def signature(code):
        row = ["sig", "!", "", "1", p["primaryFingerprint"][-16:], "1736268781", "", "", "", "synthetic fixture", code + "x", "", p["primaryFingerprint"], ""]
        return ":".join(row) + "\n"
    return record("pub", p["primaryFingerprint"], 1460000000, 0, "scSC") + signature("13") + record("sub", p["signerFingerprint"], p["signerCreatedUnix"], p["signerExpiresUnix"], "s") + signature("18")


NOW = 1792022400  # 2026-10-15 UTC, fixed independently of host clock.
KEY = key_fixture()


def metadata_fixture(package_transform=None, release_transform=None):
    with open(os.path.join(HERE, "..", MANIFEST["provenance"]["packagesPath"]), "rb") as source:
        packages = source.read()
    with open(os.path.join(HERE, "..", MANIFEST["provenance"]["inReleasePath"]), "rb") as source:
        signed = source.read()
    plaintext = signed.split(b"\n\n", 1)[1].split(b"-----BEGIN PGP SIGNATURE-----", 1)[0]
    if package_transform is not None:
        old_hash, old_size = hashlib.sha256(packages).hexdigest(), len(packages)
        packages = package_transform(packages)
        plaintext = plaintext.replace((old_hash + " " + str(old_size)).encode(), (hashlib.sha256(packages).hexdigest() + " " + str(len(packages))).encode())
    fixture_manifest = copy.deepcopy(MANIFEST)
    fixture_manifest["provenance"]["packagesSha256"] = hashlib.sha256(packages).hexdigest()
    fixture_manifest["provenance"]["packagesBytes"] = len(packages)
    if release_transform is not None:
        plaintext = release_transform(plaintext)
    return plaintext, packages, fixture_manifest


def index_fixture(**options):
    release, packages, fixture_manifest = metadata_fixture(**options)
    return verifier.authenticate_index(release, packages, fixture_manifest)


def deb_fixture(control=b"fixture control", data=b"fixture data"):
    def entry(name, value):
        header = name.encode().ljust(16) + b"0".ljust(12) + b"0".ljust(6) + b"0".ljust(6) + b"100644".ljust(8) + str(len(value)).encode().ljust(10) + b"`\n"
        return header + value + (b"\n" if len(value) % 2 else b"")
    return b"!<arch>\n" + entry("debian-binary", b"2.0\n") + entry("control.tar.xz", control) + entry("data.tar.xz", data)


def control_fixture(text=None):
    text = text or "Package: google-chrome-stable\nVersion: 155.0.8059.79-1\nArchitecture: amd64\n"
    return tar_fixture([member("control", text.encode())])


def loader_fixture():
    interpreter = {"path": "/lib64/ld-linux-x86-64.so.2", "realPath": "/usr/lib/x86_64-linux-gnu/ld-linux-x86-64.so.2", "sha256": "a" * 64, "package": "libc6:amd64", "version": "2.36-1", "architecture": "amd64"}
    libc = {"soname": "libc.so.6", "path": "/lib/x86_64-linux-gnu/libc.so.6", "realPath": "/usr/lib/x86_64-linux-gnu/libc.so.6", "sha256": "b" * 64, "package": "libc6:amd64", "version": "2.36-1", "architecture": "amd64"}
    return {"interpreter": interpreter, "providers": [libc, {"soname": "ld-linux-x86-64.so.2", **interpreter}], "elfMembers": 1, "missing": [], "environmentClean": True}


def raw_fixture(data, size, sha):
    with tempfile.TemporaryFile() as fixture:
        fixture.write(data)
        fixture.flush()
        return verifier.hash_fd(fixture.fileno(), size, sha)


positive("frozen manifest identity", "CONFIG_FROZEN_IDENTITY", lambda: verifier.verify_bytes(manifest_bytes, verifier.MANIFEST_BYTES, verifier.MANIFEST_SHA256, "CONFIG_FROZEN_IDENTITY"))
positive("complete schema", "validate_manifest full approved schema", lambda: verifier.validate_manifest(MANIFEST))
negative("missing runtime", "CONFIG_SCHEMA", lambda: verifier.validate_manifest({key: value for key, value in MANIFEST.items() if key != "runtime"}))
negative("additional field", "CONFIG_SCHEMA", lambda: verifier.validate_manifest({**MANIFEST, "extra": True}))
negative("boolean schema integer", "CONFIG_IDENTITY", lambda: verifier.validate_manifest(changed(MANIFEST, ["schemaVersion"], True)))
negative("wrong product", "CONFIG_IDENTITY", lambda: verifier.validate_manifest(changed(MANIFEST, ["product"], "chromium")))
negative("wrong input digest", "CONFIG_SOURCE_IDENTITY", lambda: verifier.validate_manifest(changed(MANIFEST, ["source", "sha256"], "a" * 64)))
negative("source credentials", "CONFIG_SOURCE_IDENTITY", lambda: verifier.validate_manifest(changed(MANIFEST, ["source", "url"], "https://user:password@dl.google.com/browser")))
negative("wrong key authority", "CONFIG_PROVENANCE_IDENTITY", lambda: verifier.validate_manifest(changed(MANIFEST, ["provenance", "primaryFingerprint"], "A" * 40)))
negative("weak key policy", "CONFIG_KEY_POLICY", lambda: verifier.validate_manifest(changed(MANIFEST, ["keyStatusPolicy", "requireActualSubkeyBinding"], False)))
negative("numeric key-policy boolean", "CONFIG_KEY_POLICY", lambda: verifier.validate_manifest(changed(MANIFEST, ["keyStatusPolicy", "requireActualSubkeyBinding"], 1)))
negative("numeric installation boolean", "CONFIG_INSTALLATION_POLICY", lambda: verifier.validate_manifest(changed(MANIFEST, ["installation", "persistentExtractedCache"], 0)))
negative("missing filesystem assertion", "CONFIG_FILESYSTEM_POLICY", lambda: verifier.validate_manifest(changed(MANIFEST, ["filesystemPolicy", "directoryRelativeNoFollow"], False)))
negative("missing inventory member", "CONFIG_INVENTORY_COUNT", lambda: verifier.validate_manifest(changed(MANIFEST, ["runtime", "expectedMembers"], MANIFEST["runtime"]["expectedMembers"][:-1])))
negative("invalid inventory digest", "CONFIG_MEMBER_DIGEST", lambda: verifier.validate_manifest(changed(MANIFEST, ["runtime", "expectedMembers", 1, "sha256"], "TK")))
negative("unbounded resource policy", "CONFIG_LIMITS", lambda: verifier.validate_manifest(changed(MANIFEST, ["runtime", "limits", "members"], 999999)))
negative("duplicate JSON key", "JSON_DUPLICATE_KEY", lambda: verifier.parse_json(b'{"x":1,"x":2}'))
negative("nonfinite JSON", "JSON_NONFINITE", lambda: verifier.parse_json(b'{"x":NaN}'))
negative("malformed JSON", "JSON_MALFORMED", lambda: verifier.parse_json(b'{'))

positive("synthetic valid key status", "parse_key_status actual status predicate; synthetic trusted GPG output", lambda: verifier.parse_key_status(KEY, MANIFEST["provenance"], NOW))
negative("current signing material changed", "CURRENT_KEY_IDENTITY", lambda: verifier.verify_bytes(b"synthetic wrong current public key", verifier.KEY_BYTES, MANIFEST["provenance"]["keySha256"], "CURRENT_KEY_IDENTITY"))
negative("wrong actual signer", "KEY_SIGNING_IDENTITY", lambda: verifier.parse_key_status(KEY.replace(MANIFEST["provenance"]["signerFingerprint"], "A" * 40), MANIFEST["provenance"], NOW))
negative("revoked signing subkey", "KEY_UNUSABLE_STATUS", lambda: verifier.parse_key_status(KEY.replace("sub:-:", "sub:r:"), MANIFEST["provenance"], NOW))
negative("disabled signing subkey", "KEY_UNUSABLE_STATUS", lambda: verifier.parse_key_status(KEY.replace(":s:\n", ":sD:\n"), MANIFEST["provenance"], NOW))
negative("expired signing subkey", "KEY_LIFETIME", lambda: verifier.parse_key_status(KEY.replace(str(MANIFEST["provenance"]["signerExpiresUnix"]), str(NOW - 1)), MANIFEST["provenance"], NOW))
negative("unsigned primary", "KEY_SELF_SIGNATURE", lambda: verifier.parse_key_status(KEY.replace("13x", "20x"), MANIFEST["provenance"], NOW))
negative("invalid binding signature", "KEY_SUBKEY_BINDING", lambda: verifier.parse_key_status(KEY.replace("18x", "19x"), MANIFEST["provenance"], NOW))
negative("binding not cryptographically good", "KEY_SUBKEY_BINDING", lambda: verifier.parse_key_status("sig:-:".join(KEY.rsplit("sig:!:", 1)), MANIFEST["provenance"], NOW))
negative("no actual signing capability", "KEY_SIGNING_CAPABILITY", lambda: verifier.parse_key_status(KEY.replace(":s:\n", ":e:\n"), MANIFEST["provenance"], NOW))
negative("unsafe clock before signed release", "KEY_CLOCK", lambda: verifier.parse_key_status(KEY, MANIFEST["provenance"], 1))
negative("unsafe clock after signer expiry", "KEY_CLOCK", lambda: verifier.parse_key_status(KEY, MANIFEST["provenance"], MANIFEST["provenance"]["signerExpiresUnix"]))
positive("synthetic valid signed metadata status", "parse_signature_status actual predicate; synthetic trusted GPG output", lambda: verifier.parse_signature_status(signature_fixture(), MANIFEST["provenance"], NOW))
negative("invalid signature", "SIGNATURE_INVALID", lambda: verifier.parse_signature_status(signature_fixture(status="BADSIG"), MANIFEST["provenance"], NOW))
negative("signature missing", "SIGNATURE_STATUS_MISSING", lambda: verifier.parse_signature_status("[GNUPG:] NEWSIG\n", MANIFEST["provenance"], NOW))
negative("signature wrong signer", "SIGNATURE_SIGNING_IDENTITY", lambda: verifier.parse_signature_status(signature_fixture(signer="A" * 40), MANIFEST["provenance"], NOW))
negative("signature wrong primary", "SIGNATURE_SIGNING_IDENTITY", lambda: verifier.parse_signature_status(signature_fixture(primary="A" * 40), MANIFEST["provenance"], NOW))
negative("signature weak hash", "SIGNATURE_ALGORITHM", lambda: verifier.parse_signature_status(signature_fixture(hash_id="2"), MANIFEST["provenance"], NOW))
negative("duplicate valid signatures", "SIGNATURE_STATUS_MISSING", lambda: verifier.parse_signature_status(signature_fixture() * 2, MANIFEST["provenance"], NOW))
negative("signature from future", "SIGNATURE_LIFETIME", lambda: verifier.parse_signature_status(signature_fixture().replace("1791969399", str(NOW + 1000)), MANIFEST["provenance"], NOW))
positive("retained plaintext and Packages fixture", "authenticate_index repository and exact product entry", index_fixture)
negative("repository identity mismatch", "REPOSITORY_METADATA", lambda: index_fixture(release_transform=lambda value: value.replace(b"Origin: Google LLC", b"Origin: attacker")))
negative("repository index mismatch", "REPOSITORY_INDEX_IDENTITY", lambda: index_fixture(release_transform=lambda value: value.replace(MANIFEST["provenance"]["packagesSha256"].encode(), b"a" * 64)))
negative("repository architecture mismatch", "REPOSITORY_ARCHITECTURE", lambda: index_fixture(release_transform=lambda value: value.replace(b"Architectures: amd64 arm64", b"Architectures: arm64")))
negative("duplicate indexed product", "PACKAGE_INDEX_UNIQUE", lambda: index_fixture(package_transform=lambda value: value.replace(b"Package: google-chrome-beta", b"Package: google-chrome-stable")))
negative("package version mismatch", "PACKAGE_INDEX_VERSION", lambda: index_fixture(package_transform=lambda value: value.replace(b"Version: 155.0.8059.79-1", b"Version: 155.0.8059.80-1")))
negative("package architecture mismatch", "PACKAGE_INDEX_ARCHITECTURE", lambda: index_fixture(package_transform=lambda value: value.replace(b"Package: google-chrome-stable\nVersion: 155.0.8059.79-1\nArchitecture: amd64", b"Package: google-chrome-stable\nVersion: 155.0.8059.79-1\nArchitecture: arm64")))
negative("package exact input mismatch", "PACKAGE_INDEX_INPUT", lambda: index_fixture(package_transform=lambda value: value.replace(MANIFEST["source"]["sha256"].encode(), b"a" * 64)))
negative("duplicate Debian metadata field", "METADATA_DUPLICATE_OR_MALFORMED", lambda: verifier.deb822(b"Package: x\nPackage: y\n"))
negative("invalid metadata continuation", "METADATA_CONTINUATION", lambda: verifier.deb822(b" continuation\n"))

positive("raw fixture identity", "hash_fd length and SHA256", lambda: raw_fixture(b"raw fixture", 11, hashlib.sha256(b"raw fixture").hexdigest()))
negative("raw digest mismatch", "RAW_DIGEST", lambda: raw_fixture(b"raw fixture", 11, "a" * 64))
negative("raw truncation", "RAW_LENGTH", lambda: raw_fixture(b"raw fixture", 12, "a" * 64))
negative("raw overlength", "RAW_LENGTH", lambda: raw_fixture(b"raw fixture", 10, "a" * 64))
positive("bounded synthetic DEB framing", "validate_deb ar structure", lambda: verifier.validate_deb(io.BytesIO(deb_fixture()), len(deb_fixture())))
negative("DEB wrong magic", "DEB_MAGIC", lambda: verifier.validate_deb(io.BytesIO(b"invalid!"), 8))
negative("DEB truncated ar header", "DEB_TRUNCATED_HEADER", lambda: verifier.validate_deb(io.BytesIO(deb_fixture()[:30]), 30))
negative("DEB truncated payload", "DEB_MEMBER_BOUNDS_OR_DUPLICATE", lambda: verifier.validate_deb(io.BytesIO(deb_fixture()[:-8]), len(deb_fixture()) - 8))
negative("DEB unsupported member", "DEB_MEMBER_LAYOUT", lambda: verifier.validate_deb(io.BytesIO(deb_fixture().replace(b"data.tar.xz", b"data.tar.xx")), len(deb_fixture())))
positive("synthetic control identity", "control_identity all Package/Version/Architecture predicates", lambda: verifier.control_identity(io.BytesIO(control_fixture()), MANIFEST))
for field, old, new, code in (("package", "google-chrome-stable", "wrong-browser", "CONTROL_PACKAGE"), ("version", "155.0.8059.79-1", "155.0.8059.80-1", "CONTROL_VERSION"), ("architecture", "amd64", "arm64", "CONTROL_ARCHITECTURE")):
    # Build with tarfile so the injected control remains an authenticated parseable subject.
    text = "Package: " + (new if field == "package" else "google-chrome-stable") + "\nVersion: " + (new if field == "version" else "155.0.8059.79-1") + "\nArchitecture: " + (new if field == "architecture" else "amd64") + "\n"
    negative("control " + field + " mismatch", code, lambda text=text: verifier.control_identity(io.BytesIO(control_fixture(text)), MANIFEST))

positive("selected archive and ELF inventory", "archive_inventory full input-derived membership/hash/mode/ELF", inventory)
negative("archive truncated header", "ARCHIVE_TRUNCATED_HEADER", lambda: inventory(tar_fixture()[:100]))
first_end_block = sum(512 + ((len(data) + 511) // 512) * 512 for row, data in BASE)
negative("archive missing second zero end block", "ARCHIVE_END_MARKER", lambda: inventory(tar_fixture()[:first_end_block + 512]))
bad_checksum = bytearray(tar_fixture()); bad_checksum[0] ^= 1
negative("archive malformed checksum", "ARCHIVE_MALFORMED_OR_TRUNCATED", lambda: inventory(bytes(bad_checksum)))
for name, code in (("../escape", "ARCHIVE_PATH_TRAVERSAL"), ("/absolute", "ARCHIVE_ABSOLUTE_PATH"), ("C:/absolute", "ARCHIVE_ABSOLUTE_PATH"), ("opt\\evil", "ARCHIVE_PATH_CONTROLS"), ("opt//evil", "ARCHIVE_PATH_TRAVERSAL")):
    negative("archive " + name, code, lambda name=name: inventory(tar_fixture(BASE + [member(name, b"bad")])) )
negative("canonical duplicate destination", "ARCHIVE_CANONICAL_DUPLICATE", lambda: inventory(tar_fixture(BASE + [member("./opt/google/chrome/resources.pak", b"synthetic resource")])))
negative("directory file collision", "ARCHIVE_CANONICAL_DUPLICATE", lambda: inventory(tar_fixture(BASE + [member("opt/google/chrome", b"file")])) )
negative("unexpected selected member", "ARCHIVE_UNEXPECTED_MEMBER", lambda: inventory(tar_fixture(BASE + [member("opt/google/chrome/extra", b"extra")])) )
negative("missing selected member", "ARCHIVE_INVENTORY_MEMBERSHIP", lambda: inventory(tar_fixture(BASE[:-1])))
negative("wrong selected bytes", "ARCHIVE_MEMBER_IDENTITY", lambda: inventory(tar_fixture(BASE[:-1] + [member("opt/google/chrome/resources.pak", b"wrong")])))
negative("world writable mode", "ARCHIVE_PRIVILEGED_MODE", lambda: inventory(tar_fixture(BASE[:-1] + [member("opt/google/chrome/resources.pak", b"synthetic resource", mode=0o666)])))
negative("unexpected setuid mode", "ARCHIVE_PRIVILEGED_MODE", lambda: inventory(tar_fixture(BASE[:-1] + [member("opt/google/chrome/resources.pak", b"synthetic resource", mode=0o4644)])))
negative("hardlink escape", "ARCHIVE_HARDLINK", lambda: inventory(tar_fixture(BASE + [member("opt/google/chrome/link", kind="1", target="../../etc/passwd")])))
negative("special FIFO member", "ARCHIVE_MEMBER_TYPE", lambda: inventory(tar_fixture(BASE + [member("opt/google/chrome/fifo", kind="6")])))
links = BASE + [member("opt/google/chrome/link", kind="2", mode=0o777, target="resources.pak")]
positive("authenticated contained relative symlink", "contained_link and validate_link_chain", lambda: inventory(tar_fixture(links), fixture_runtime(links)))
for target in ("../../../etc/passwd", "/etc/passwd"):
    entries = BASE + [member("opt/google/chrome/link", kind="2", mode=0o777, target=target)]
    negative("symlink escape " + target, "ARCHIVE_LINK_ESCAPE", lambda entries=entries: inventory(tar_fixture(entries), fixture_runtime(entries)))
dangling = BASE + [member("opt/google/chrome/link", kind="2", mode=0o777, target="missing")]
negative("dangling symlink", "ARCHIVE_LINK_DANGLING", lambda: inventory(tar_fixture(dangling), fixture_runtime(dangling)))
cycle = BASE + [member("opt/google/chrome/a", kind="2", mode=0o777, target="b"), member("opt/google/chrome/b", kind="2", mode=0o777, target="a")]
negative("chained symlink cycle", "ARCHIVE_LINK_CYCLE", lambda: inventory(tar_fixture(cycle), fixture_runtime(cycle)))
negative("resource member count", "RESOURCE_MEMBER_LIMIT", lambda: inventory(runtime=changed(RUNTIME, ["limits", "members"], 2)))
negative("resource expanded bytes", "RESOURCE_EXPANDED_LIMIT", lambda: inventory(runtime=changed(RUNTIME, ["limits", "expandedRegularBytes"], 8)))
negative("resource ELF bytes", "RESOURCE_ELF_LIMIT", lambda: inventory(runtime=changed(RUNTIME, ["limits", "elfMemberBytes"], 8)))
negative("resource wall deadline", "RESOURCE_WALL_LIMIT", lambda: verifier.archive_inventory(io.BytesIO(tar_fixture()), RUNTIME, deadline=0))
negative("inventory count binding", "ARCHIVE_INVENTORY_BINDING", lambda: inventory(runtime=changed(RUNTIME, ["inventoryBinding", "selectedMemberCount"], 99)))

positive("ELF binary positive", "elf_identity ELF64 machine/interpreter/dynamic NEEDED", lambda: verifier.elf_identity(io.BytesIO(ELF), len(ELF)))
negative("ELF truncated", "ELF_BOUNDS", lambda: verifier.elf_identity(io.BytesIO(ELF[:20]), 20))
negative("ELF missing magic", "ELF_MAGIC", lambda: verifier.elf_identity(io.BytesIO(b"nope" + ELF[4:]), len(ELF)))
negative("ELF wrong architecture", "ELF_ARCHITECTURE", lambda: verifier.elf_identity(io.BytesIO(ELF[:4] + b"\x01" + ELF[5:]), len(ELF)))
negative("ELF wrong machine", "ELF_HEADER", lambda: verifier.elf_identity(io.BytesIO(ELF[:18] + struct.pack("<H", 183) + ELF[20:]), len(ELF)))
unsafe = elf_fixture(rpath="$ORIGIN/../../evil")
negative("ELF unsafe RUNPATH", "ELF_SEARCH_PATH", lambda: verifier.elf_identity(io.BytesIO(unsafe), len(unsafe)))
wrong_interp = elf_fixture(interpreter="/tmp/evil-loader")
negative("ELF wrong interpreter", "ELF_INTERPRETER", lambda: verifier.elf_identity(io.BytesIO(wrong_interp), len(wrong_interp)))
no_needed = elf_fixture(needed=())
negative("ELF missing required dependencies", "ELF_NEEDED", lambda: verifier.elf_identity(io.BytesIO(no_needed), len(no_needed)))
negative("ELF expected evidence missing", "ELF_EVIDENCE_SCHEMA", lambda: verifier.validate_elf_evidence({}))
negative("ELF duplicate NEEDED", "ELF_NEEDED", lambda: verifier.validate_elf_evidence({**ELF_IDENTITY, "needed": ["libc.so.6", "libc.so.6"]}))

trace = b"\tlinux-vdso.so.1 (0x00007fff12340000)\n\tlibc.so.6 => /lib/x86_64-linux-gnu/libc.so.6 (0x00007f1234000000)\n\t/lib64/ld-linux-x86-64.so.2 (0x00007f1234560000)\n"
positive("synthetic trusted loader trace", "parse_loader_output exact closure observations", lambda: verifier.parse_loader_output(trace))
negative("missing loader provider", "LOADER_MISSING_PROVIDER", lambda: verifier.parse_loader_output(b"libc.so.6 => not found\n"))
negative("malformed loader output", "LOADER_OUTPUT_MALFORMED", lambda: verifier.parse_loader_output(b"unverified wrapper output\n"))
negative("conflicting loader provider", "LOADER_PROVIDER_CONFLICT", lambda: verifier.parse_loader_output(trace + b"libc.so.6 => /tmp/libc.so.6 (0x00)\n"))
positive("complete typed provider fixture", "validate_provider_receipt actual complete predicate", lambda: verifier.validate_provider_receipt(loader_fixture(), RUNTIME))
negative("provider receipt missing", "PROVIDER_RECEIPT_SCHEMA", lambda: verifier.validate_provider_receipt(None, RUNTIME))
negative("provider receipt unexpected field", "PROVIDER_RECEIPT_SCHEMA", lambda: verifier.validate_provider_receipt({**loader_fixture(), "extra": True}, RUNTIME))
negative("provider receipt empty providers", "PROVIDER_RECEIPT_PROVIDERS", lambda: verifier.validate_provider_receipt(changed(loader_fixture(), ["providers"], []), RUNTIME))
negative("provider receipt missing required SONAME", "PROVIDER_REQUIRED_SONAME", lambda: verifier.validate_provider_receipt(changed(loader_fixture(), ["providers"], loader_fixture()["providers"][1:]), RUNTIME))
negative("provider receipt malformed hash", "PROVIDER_ENTRY_IDENTITY", lambda: verifier.validate_provider_receipt(changed(loader_fixture(), ["providers", 0, "sha256"], "TK"), RUNTIME))
negative("provider receipt wrong architecture", "PROVIDER_ENTRY_IDENTITY", lambda: verifier.validate_provider_receipt(changed(loader_fixture(), ["providers", 0, "architecture"], "arm64"), RUNTIME))
negative("provider receipt untrusted root", "PROVIDER_ENTRY_ROOT", lambda: verifier.validate_provider_receipt(changed(loader_fixture(), ["providers", 0, "realPath"], "/tmp/libc.so.6"), RUNTIME))
negative("provider receipt traversal", "PROVIDER_ENTRY_ROOT", lambda: verifier.validate_provider_receipt(changed(loader_fixture(), ["providers", 0, "realPath"], "/usr/lib/../../tmp/libc.so.6"), RUNTIME))
negative("provider duplicate SONAME", "PROVIDER_DUPLICATE_SONAME", lambda: verifier.validate_provider_receipt(changed(loader_fixture(), ["providers"], loader_fixture()["providers"] + [loader_fixture()["providers"][0]]), RUNTIME))
negative("provider interpreter inconsistency", "PROVIDER_INTERPRETER_CONFLICT", lambda: verifier.validate_provider_receipt(changed(loader_fixture(), ["providers", 1, "sha256"], "c" * 64), RUNTIME))
negative("provider false environment evidence", "PROVIDER_RECEIPT_INCOMPLETE", lambda: verifier.validate_provider_receipt(changed(loader_fixture(), ["environmentClean"], False), RUNTIME))
positive("browser exact version output predicate", "browser_version exact product/version/exit status, no process executed", lambda: verifier.browser_version(b"Google Chrome 155.0.8059.79\n", 0, MANIFEST))
negative("browser wrapper or extra output", "BROWSER_VERSION_IDENTITY", lambda: verifier.browser_version(b"Google Chrome 155.0.8059.79\nwrapper\n", 0, MANIFEST))
negative("browser wrong product", "BROWSER_VERSION_IDENTITY", lambda: verifier.browser_version(b"Chromium 155.0.8059.79\n", 0, MANIFEST))
negative("browser wrong version", "BROWSER_VERSION_IDENTITY", lambda: verifier.browser_version(b"Google Chrome 155.0.8059.80\n", 0, MANIFEST))
negative("browser nonzero exit", "BROWSER_VERSION_EXIT", lambda: verifier.browser_version(b"Google Chrome 155.0.8059.79\n", 1, MANIFEST))
positive("sanitized child environment", "clean_environment minimal environment; runner artifact trust remains separate", lambda: verifier.clean_environment({"ACTIONS_RUNTIME_TOKEN": "synthetic-platform-value"}))
positive("inert Python image metadata", "clean_environment permits inert version/hash metadata", lambda: verifier.clean_environment({"PYTHON_VERSION": "3.12.12", "PYTHON_SHA256": "synthetic-image-metadata"}))
negative("loader environment injection", "RUNTIME_ENVIRONMENT_OVERRIDE", lambda: verifier.clean_environment({"LD_PRELOAD": "/tmp/injected.so"}))
negative("installation credential present", "RUNTIME_ENVIRONMENT_OVERRIDE", lambda: verifier.clean_environment({"NPM_TOKEN": "synthetic-secret"}))
negative("alternate loader controls", "RUNTIME_ENVIRONMENT_OVERRIDE", lambda: verifier.clean_environment({"GLIBC_TUNABLES": "synthetic"}))

base_stat = types.SimpleNamespace(st_dev=1, st_ino=2, st_size=3, st_mtime_ns=4, st_ctime_ns=5, st_mode=stat.S_IFREG | 0o600, st_uid=1000, st_gid=1000, st_nlink=1)
positive("stable descriptor predicate", "stable_identity equal file/stat tuples; synthetic metadata", lambda: verifier.stable_identity(base_stat, copy.copy(base_stat), copy.copy(base_stat)))
for field in ("st_ino", "st_size", "st_mtime_ns", "st_ctime_ns", "st_mode", "st_uid", "st_nlink"):
    replacement = copy.copy(base_stat)
    setattr(replacement, field, getattr(replacement, field) + 1)
    negative("file replacement mutation " + field, "FILESYSTEM_INPUT_REPLACED", lambda replacement=replacement: verifier.stable_identity(base_stat, base_stat, replacement))


def linux_filesystem_fixtures():
    positive("Linux bounded fixture subprocess", "run_bounded actual pipe observation", lambda: verifier.require(verifier.run_bounded([sys.executable, "-I", "-B", "-S", "-c", "print('fixture')"])[0] == b"fixture\n", "FIXTURE_SUBPROCESS_OUTPUT"))
    negative("Linux actual subprocess output bound", "RESOURCE_TOOL_OUTPUT_LIMIT", lambda: verifier.run_bounded([sys.executable, "-I", "-B", "-S", "-c", "print('x'*1024)"], maximum=128))
    negative("Linux actual subprocess deadline", "RESOURCE_WALL_LIMIT", lambda: verifier.run_bounded([sys.executable, "-I", "-B", "-S", "-c", "import time; time.sleep(1)"], timeout=0.01))
    # A standard root-owned /tmp ancestor is tested by the production directory predicate.
    with tempfile.TemporaryDirectory(prefix="gs-browser-fixtures-", dir="/tmp") as job:
        os.chmod(job, 0o700)
        root = os.path.join(job, "runtime")
        rows, _ = inventory()
        expected = {row["path"]: row for row in rows}
        tree = verifier.OutputTree(root, create=True)
        try:
            inventory_bytes = io.BytesIO(tar_fixture())
            verifier.archive_inventory(inventory_bytes, RUNTIME, write=tree.write)
            positive("Linux anchored positive tree", "OutputTree.verify actual Linux nofollow output inventory", lambda: tree.verify(expected))
            executable = os.path.join(root, "opt/google/chrome/chrome")
            with open(executable, "ab") as source:
                source.write(b"tamper")
            negative("Linux output file mutation", "RAW_LENGTH", lambda: tree.verify(expected))
            os.unlink(executable)
            os.symlink("/etc/passwd", executable)
            negative("Linux final symlink substitution", "FILESYSTEM_OUTPUT_TYPE", lambda: tree.verify(expected))
            os.unlink(executable)
            tree.write(BASE[1][0], io.BytesIO(BASE[1][1]))
            with open(os.path.join(root, "extra"), "wb") as source:
                source.write(b"extra")
            negative("Linux extra output member", "FILESYSTEM_OUTPUT_INVENTORY", lambda: tree.verify(expected))
            os.unlink(os.path.join(root, "extra"))
            os.unlink(os.path.join(root, "opt/google/chrome/resources.pak"))
            negative("Linux missing output member", "FILESYSTEM_OUTPUT_INVENTORY", lambda: tree.verify(expected))
        finally:
            tree.close()
        raw = os.path.join(job, "browser.deb")
        with open(raw, "wb") as source:
            source.write(b"synthetic raw")
        os.chmod(raw, 0o600)
        def replace_opened():
            with verifier.opened(raw, private=True):
                os.rename(raw, raw + ".old")
                with open(raw, "wb") as source:
                    source.write(b"synthetic raw")
                os.chmod(raw, 0o600)
        negative("Linux opened inode replacement", "FILESYSTEM_INPUT_REPLACED", replace_opened)
        os.unlink(raw)
        os.symlink(raw + ".old", raw)
        def open_symlink():
            with verifier.opened(raw, private=True):
                pass
        negative("Linux actual nofollow file open", "FILESYSTEM_NOFOLLOW_FILE", open_symlink)
        os.symlink(root, os.path.join(job, "linked-parent"))
        def open_parent():
            with verifier.directory(os.path.join(job, "linked-parent")):
                pass
        negative("Linux actual nofollow parent open", "FILESYSTEM_NOFOLLOW_DIRECTORY", open_parent)
        os.chmod(job, 0o777)
        def writable_parent():
            with verifier.directory(job):
                pass
        negative("Linux untrusted writable ancestor", "FILESYSTEM_PARENT_WRITABLE", writable_parent)
        os.chmod(job, 0o700)
        negative("Linux existing extracted cache root", "FILESYSTEM_FRESH_ROOT_REQUIRED", lambda: verifier.OutputTree(root, create=True))


if sys.platform == "linux":
    verifier.capabilities()
    linux_filesystem_fixtures()
    filesystem_status = "SELFTEST VERIFIED synthetic Linux files only"
else:
    negative("unsupported nofollow extraction capability", "LINUX_NOFOLLOW_CAPABILITY_REQUIRED", verifier.capabilities)
    filesystem_status = "NOT RUN: Linux dir_fd/O_NOFOLLOW required; current " + sys.platform

print(json.dumps({"schemaVersion": 1, "result": "PASS", "classification": "DETERMINISTIC FIXTURE SELFTESTS ONLY", "tests": len(RESULTS), "reachedPredicates": sorted({row["reachedPredicate"] for row in RESULTS}), "results": RESULTS, "linuxFilesystem": filesystem_status, "runtime": "NOT RUN: real package acquisition, cryptographic tool execution, extraction, loader/provider observation and Chrome execution require separate approval"}, separators=(",", ":")))
