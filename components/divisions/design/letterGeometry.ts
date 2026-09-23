/** Inter SemiBold (600), extracted from the existing next/font Latin asset.
 * G: 170 units at (340,335); S: 340 units at (473,551), matching the approved typography.
 * Exact quadratic-to-cubic conversion, with internal cuts only: no traced substitute glyphs.
 * Each filled section keeps its path while its control points align to an exact mark bar.
 */
// Lossless base-36 micro-unit deltas keep the approved six-decimal coordinates
// within the existing lazy-chunk budget. Decode once, outside the animation loop.
const points = (data: string) => {
  const values = data.split(".").map(n => parseInt(n, 36));
  for (let i = 2; i < values.length; i++) values[i] += values[i - 2];
  return values.map(n => n / 1e6);
};
export const gOutlines = [
  {
    from: points("5rj4qe.4ipt4v.0.-7wy4c.1gwtj.-6s6ji.2xtn1.-5neyo.2xtn0.-5neyo.40b8k.-4c43w.52su2.-30t95.27wlm.-1bkau.2chqd.-11629.2h2v4.-qrto.36piq.-yh4n.3ebcc.-h8kb.3lx5z.0.41xqj.0.3s3rb.lage.3i9s4.16kws.3i9s5.16kwr.34o0o.1ooxj.2r29a.26sy9.2r299.26sya.299c9.2lc0q.1rgf8.2zv38.oja6.15pey.lb5y.17cgp.i31o.18zig.soqv.1zd0e.kkk1.23hlh.cgd9.27m6i.-4hhwa.0.-4hhwa.0.-4hhwa.0.-law3.-1yvqr.-tg8l.-1rhao.-11ll2.-1k2uk.-11ll2.-1k2uk.-198kk.-1bz7j.-1gvk2.-13vki.-1gvk2.-13vkj.-1nx6z.-uc9h.-1uytv.-ksye.-1uytw.-ksyf.-21psh.-aeh8.-28gr4.0.-1b5jr.0.-19haj.3xo7.-17t1b.7vce.-2gn3j.fxc8.-29sdt.w1er.-22xo3.1c5h9.-33yuq.1zy5v.-2fwh8.2xizq.-1ru3p.3v3tk.-1ru3p.3v3tl.-vx1v.4pyva.0.5ktx1.-4f12q.1a43.-4f12q.1a44.-4f12q.1a43"),
    to: points("5qw4ps.58qerk.gykzg.0.gykzg.0.gykzg.0.ehe0i.0.ehe0i.0.ehe0i.0.6d1wy.0.6d1wy.0.6d1wy.0.0.1mu3m.0.1mu3m.0.1mu3m.0.1ut05.0.1ut06.0.1ut06.0.1q3ko.0.1q3ko.0.1q3ko.0.1o357.0.1o356.0.1o357.0.nnu8.0.nnu9.0.nnu8.-5863a.0.-58639.0.-5863a.0.-auvjd.0.-auvjd.0.-auvjd.0.-4q0a2.0.-4q0a3.0.-4q0a2.0.-4gcqf.0.-4gcqf.0.-4gcqf.0.-4jdnl.0.-4jdnl.0.-4jdnl.0.-50vau.0.-50vau.0.-50vav.0.-2zdbc.0.-2zdbd.0.-2zdbd.0.0.-17c64.0.-17c64.0.-17c64.0.-1v8gt.0.-1v8gt.0.-1v8gu.0.-2c4wb.0.-2c4wb.0.-2c4wb.0.-24s4m.0.-24s4n.0.-24s4m"),
  },
  {
    from: points("6pm65i.5kfsn0.-6rpvp.0.-5xwud.-1j1om.-543t1.-323d8.-38l6p.-1xpvm.-2sc2f.-2gdzj.-2c2y6.-2z23g.-1coxe.-1pzxm.-178p6.-1w9c2.-11sgy.-22iqj.-2v1q6.-5n7a0.-1fiv3.-6oytu.0.-7qqdp.wcgz.-9do.wcgz.-9do.wcgz.-9do.3iolr.-10qf.3iolr.-10qf.3iolr.-10qg.0.5k604.vscs.4pnrl.1rkpk.3v5j0.r0zv.1n5oz.vha9.1h5oq.zxkm.1b5og.1cl7g.1rrng.1kqap.1gsod.1sve0.15tpb.34ugc.20r75.3mu7b.10dlk.44tya.0.-uqq.3xy7y.-uqq.3xy7x.-uqq.3xy7x"),
    to: points("627d7k.8k3tk0.-4omrl.0.-4omrl.0.-4omrl.0.-2uuw9.0.-2uuwa.0.-2uuwa.0.0.-7wi7e.0.-7wi7d.0.-7wi7e.0.-ovpvt.0.-ovpvu.0.-ovpvu.0.-38i0c.0.-38i0d.0.-38i0d.2nizd.0.2nizd.0.2nizd.0.3n5dd.0.3n5dd.0.3n5dd.0.18tb4.0.18tb5.0.18tb5.0.0.81fu8.0.81fu8.0.81fu8.0.ds1c6.0.ds1c6.0.ds1c7.0.e78x5.0.e78x6.0.e78x6"),
  },
  {
    from: points("6poqdo.58lxz8.3qxik.0.3916i.-q2jk.2r4uf.-1g533.2r4uf.-1g534.24dv6.-220wd.1hmvv.-2nwpm.1hmvw.-2nwpn.qtfx.-354ab.0.-3mbv2.10kuk.5vsh.10kuj.5vsg.10kuk.5vsh.-2uz4t.0.-2uz4t.0.-2uz4s.0.-3tr6s.0.-3tr6r.0.-3tr6s.0.0.-3ghp8.0.-3ghp8.0.-3ghp8.68bjj.0.68bjj.0.68bjj.0.3pouf.0.3pouf.0.3poue.0.0.2xuhm.0.2xuhm.0.2xuhm.0.6bjgi.-1ccfg.5g8mf.-2oouw.4kxsb.-m1y0.11mca.-nxpw.znfn.-pthu.xoiy.-2fdnh.35zi7.-30xwc.2jfdx.-3mi56.1wv9m.-4p2dk.2h7us.-5dq3k.18lxd.-62dti.0.uqq.-3xy7x.uqq.-3xy7x.uqq.-3xy7y"),
    to: points("5qw4ps.88sl28.9epxp.0.9epxo.0.9epxp.0.8du5i.0.8du5i.0.8du5i.0.94sf7.0.94sf7.0.94sf7.0.2vmti.0.2vmtj.0.2vmtj.0.801l0.0.801kz.0.801l0.0.0.24v30.0.24v31.0.24v30.0.1xgnr.0.1xgnq.0.1xgnr.0.3h5x4.0.3h5x3.0.3h5x4.-adyh5.0.-adyh5.0.-adyh6.0.-882ou.0.-882ov.0.-882ou.0.-fw4cj.0.-fw4ci.0.-fw4ci.0.-3avee.0.-3avee.0.-3avee.0.0.-288x2.0.-288x2.0.-288x2.0.-341c5.0.-341c6.0.-341c5.0.-277en.0.-277eo.0.-277en"),
  },
];
export const sOutlines = [
  {
    from: points("9otyam.4ystme.ahqw4.0.96sus.1tb11.7vuti.3mm23.3yivo.1tkwo.3iz42.2615g.33fci.2ihe7.32hry.2hq4t.2n7ca.2tywn.27wwk.367of.4gi35.6de21.2bpq8.7atbj.6xda.888l1.-1p2vz.0.-1p2w0.0.-1p2vz.0.-6ts74.0.-6ts75.0.-6ts74.0.-o08x.-6btrh.-2tsi3.-4wdg6.-4zkr8.-3gx4u.-l5ov.-epv1.-lw6q.-duna.-mmol.-czfk.-4pfu7.-2p7u9.-5up8c.-1clx5.-6zymj.0.4jyw.-7hae2.4jyx.-7hae1.4jyx.-7hae2"),
    to: points("5qw4ps.58qerk.qhdu4.0.qhdu3.0.qhdu4.0.bbn2s.0.bbn2t.0.bbn2s.0.0.28mtb.0.28mtb.0.28mtb.0.4coad.0.4coac.0.4coac.0.y6k8.0.y6k7.0.y6k7.-j5jol.0.-j5jok.0.-j5jol.0.-gemab.0.-gemaa.0.-gemab.0.-28uy1.0.-28uy0.0.-28uy1.0.0.-3crml.0.-3crml.0.-3crml.0.-46q1a.0.-46q19.0.-46q1a"),
  },
  {
    from: points("870tnj.66674p.0.-8ok5f.2chwm.-7lhmq.4ozt9.-6if42.359wq.-4d4n1.3wv9p.-3pm88.4ogmo.-323th.2av5u.-1i5s7.2hjil.-1cgzg.2o7vc.-16s6q.83trb.-3lrbd.96sut.-1svno.a9rya.0.-w43.1gqnv.-w44.1gqnv.-w43.1gqnu.-3nuu.60jq7.-3nut.60jq7.-3nut.60jq7.-5ip28.0.-4rgoi.u3q2.-408ar.1o7g4.-2touy.16g66.-2cyvv.1hkhy.-1w8ws.1sotq.-sjsk.r27n.-pmg6.t09o.-mp3s.uybp.-24ydb.2wy35.-12h6n.3bp9u.0.3qggl.-8wmdm.isck.-8wmdn.iscj.-8wmdm.iscj"),
    to: points("627d7k.8k3tk0.-4h6yc.0.-4h6yb.0.-4h6yc.0.-32apj.0.-32apj.0.-32apj.0.0.-774yv.0.-774yv.0.-774yv.0.-oy39b.0.-oy39b.0.-oy39b.0.-3vhve.0.-3vhve.0.-3vhve.3bwzs.0.3bwzt.0.3bwzs.0.2p0km.0.2p0km.0.2p0kn.0.1ik3g.0.1ik3g.0.1ik3g.0.0.310e3.0.310e3.0.310e2.0.9ecoa.0.9ecoa.0.9eco9.0.nld18.0.nld17.0.nld18"),
  },
  {
    from: points("9a5c2l.79q2yi.-c9ifr.-35ao0.-9l4oh.-4s3p5.-6wqx5.-6ewq8.-1186t.-yk2v.-yfwi.-105tp.-vnm7.-11rkk.-4zv45.-5ykuv.-2hxk2.-7ed34.0.-8u5bd.494z4.-8z1l.494z4.-8z1k.494z5.-8z1k.4nhei.-9taz.4nhei.-9taz.4nhei.-9taz.0.44b75.19kj6.3dj13.2j52b.2mqv1.2j52b.2mqv1.371vr.23tda.3uyp7.1kvvk.arc.4ek.arc.4ei.ard.4ef.3uo5n.1kptr.3w2aw.1a410.3xgg3.zi8a.-483pq.6xu4m.-483pq.6xu4l.-483pq.6xu4m"),
    to: points("8wb7gg.8vf21s.-xgzd3.0.-xgzd2.0.-xgzd3.0.-4c1jt.0.-4c1ju.0.-4c1jt.0.0.-4wuud.0.-4wuud.0.-4wuuc.0.-2mmti.0.-2mmti.0.-2mmti.eeusf.0.eeusg.0.eeusf.0.bfxsn.0.bfxsm.0.bfxsn.0.bx8wv.0.bx8wv.0.bx8wv.0.zez.0.zez.0.zez.0.0.2j1qk.0.2j1qk.0.2j1qk.0.50fxb.0.50fxa.0.50fxb"),
  },
  {
    from: points("9qvee1.7e37tm.-5kort.-1gdmd.-5koru.-1gdme.-5kort.-1gdmd.gce2.-qugl.gce2.-qugk.gce2.-qugk.3g798.-5o097.3g797.-5o097.3g798.-5o096.bk2g.-izev.bk2h.-izeu.bk2g.-izev.4l77a.16840.4l77a.16840.4l77a.16841.-iv9k.162ei.-iv9l.162ej.-iv9k.162ei.-2pqvm.61x8h.-2pqvm.61x8g.-2pqvn.61x8g"),
    to: points("al1f5s.7jhnuo.-x6bx8.0.-x6bx8.0.-x6bx8.0.-50ze7.0.-50ze6.0.-50ze7.0.0.-7jhnv.0.-7jhnu.0.-7jhnv.3jz86.0.3jz87.0.3jz86.0.r9uom.0.r9uol.0.r9uom.0.7dhen.0.7dhem.0.7dhen.0.0.7jhnv.0.7jhnu.0.7jhnv"),
  },
  {
    from: points("ahi5dk.7yisiu.0.-3ucil.-13x9z.-367zw.-27ujx.-2i3h7.-27ujx.-2i3h7.-33pgm.-2411z.-3zkdb.-1pymr.-3zkda.-1pymq.-4ny99.-1ixuk.-5cc5a.-1bx2d.8d9l.-innx.8d9l.-innw.8d9l.-innx.308vm.-6pbz2.308vm.-6pbz2.308vl.-6pbz2.5800a.18kf4.536mk.1nltt.4yd8t.22n8h.7ppd.387t.7pdq.398a.7p21.3a8q.55naz.278b2.4n1si.2rgrh.44ga4.3bp7w.44ga3.3bp7w.39sxh.40vb4.2f5ku.4q1ed.rr2r.1i56x.nc0f.1l7i9.iwy4.1o9tm.14hjz.3l0gm.k8s0.3z1vw.0.4d3b9.-8sco0.-29zh.-8sco0.-29zg.-8sco0.-29zh"),
    to: points("a9q6o0.a7cg8w.0.-9o51d.0.-9o51c.0.-9o51d.0.-amz1t.0.-amz1u.0.-amz1t.0.-dteeh.0.-dteeh.0.-dteeh.0.-1lht1.0.-1lht1.0.-1lht1.4d02e.0.4d02d.0.4d02e.0.36hlh.0.36hlh.0.36hlh.0.0.ngcc.0.ngcd.0.ngcc.0.f8e5f.0.f8e5f.0.f8e5g.0.eoxcm.0.eoxcm.0.eoxcm.0.558gb.0.558ga.0.558ga.-2bpc0.0.-2bpc1.0.-2bpc0.0.-57sbv.0.-57sbu.0.-57sbu.0"),
  },
  {
    from: points("9o5gy1.96c3z1.-be3qg.0.-9wpeq.-1s0wy.-8fb2x.-3k1tw.-8fb2y.-3k1tw.-6ko8d.-568nk.-4q1ds.-6sfh8.-3c89b.-4stv5.-29cpp.-5j34l.-16h62.-69ce2.-hlib.-2lctq.-axay.-2pv29.-493l.-2udaq.8nzk1.0.8nzk1.0.8nzk1.0.fk80.55lmx.1m00p.4a8nn.2sftd.3evod.2sfte.3evod.3nzmh.2jsy4.4jjfk.1oq7t.3whru.1g64v.49gsg.tref.4mft2.7co1.ravh.17ey.rnfw.lph.s00a.0.5sukl.0.54bjo.-vvru.4fsis.-1rrjn.4fsir.-1rrjo.3h6jj.-2hljs.2ikkb.-37fjy.2ikkb.-37fjy.19aa5.-3phg3.0.-47jc9.8sco0.29zh.8sco0.29zg.8sco0.29zh.0.1vpl0.-3ran.1txyy.-7il8.1s6cw.-qz9y.6ecz7.-23egp.5rld9.-3ftnf.54tr9.-4ebim.6kbfw.-6cnle.5423v.-8azo5.3nsrt.-8azo4.3nsrt.-a0rgi.1twdx.-bqj8v.0"),
    to: points("7efh7k.ainoqo.0.-32wsf.0.-32wsf.0.-32wse.0.-2ktc5.0.-2ktc4.0.-2ktc5.0.-1vrjb.0.-1vrjc.0.-1vrjb.3y7s9.0.3y7s8.0.3y7s9.0.dchde.0.dchdf.0.dchdf.0.75r2m.0.75r2m.0.75r2m.0.6ylne.0.6ylnf.0.6ylne.0.6s9fr.0.6s9fr.0.6s9fr.0.0.7wqq.0.7wqq.0.7wqq.0.1l7lp.0.1l7lp.0.1l7lp.0.1bcqs.0.1bcqr.0.1bcqr.0.17ots.0.17ots.0.17ots.0.2o6ee.0.2o6ee.0.2o6ee.0.j5ci.0.j5cj.0.j5ci.-9o6rz.0.-9o6s0.0.-9o6rz.0.-cqaav.0.-cqaav.0.-cqaau.0.-fsu8l.0.-fsu8k.0.-fsu8l.0"),
  },
];
