import React, { ReactElement } from 'react';
import { Row, Col } from 'antd';
import QueueAnim from 'rc-queue-anim';
import ScrollOverPack from 'rc-scroll-anim/lib/ScrollOverPack';
import Gallery from 'react-photo-gallery';
import svgBgToParallax from './Helper';

const svgBg = [
  <circle id="Oval-8" stroke="#13C2C2" cx="530" cy="195" r="5" />,
  <circle id="Oval-8" fillOpacity="0.4" fill="#9EE6E6" cx="606" cy="76" r="3" />,
  <circle id="Oval-8" stroke="#13C2C2" cx="165" cy="540" r="5" />,
  <circle id="Oval-8" stroke="#CED4D9" cx="701.5" cy="650" r="3.5" />,
  <circle id="Oval-8" stroke="#F5222D" cx="526.5" cy="381.5" r="3.5" />,
  <circle id="Oval-8" fillOpacity="0.4" fill="#9EE6E6" cx="944" cy="251" r="5" />,
  <g transform="translate(0, 180)"><path d="M1182.79367,448.230356 L1186.00213,453.787581 C1186.55442,454.744166 1186.22667,455.967347 1185.27008,456.519632 C1184.96604,456.695168 1184.62116,456.787581 1184.27008,456.787581 L1177.85315,456.787581 C1176.74858,456.787581 1175.85315,455.89215 1175.85315,454.787581 C1175.85315,454.436507 1175.94556,454.091619 1176.1211,453.787581 L1179.32957,448.230356 C1179.88185,447.273771 1181.10503,446.946021 1182.06162,447.498305 C1182.36566,447.673842 1182.61813,447.926318 1182.79367,448.230356 Z" id="Polygon-2" stroke="#CED4D9" transform="translate(1181.061784, 452.008801) rotate(40.000000) translate(-1181.061784, -452.008801) " /></g>,
  <g transform="translate(0, 100)"><path d="M1376.79367,204.230356 L1380.00213,209.787581 C1380.55442,210.744166 1380.22667,211.967347 1379.27008,212.519632 C1378.96604,212.695168 1378.62116,212.787581 1378.27008,212.787581 L1371.85315,212.787581 C1370.74858,212.787581 1369.85315,211.89215 1369.85315,210.787581 C1369.85315,210.436507 1369.94556,210.091619 1370.1211,209.787581 L1373.32957,204.230356 C1373.88185,203.273771 1375.10503,202.946021 1376.06162,203.498305 C1376.36566,203.673842 1376.61813,203.926318 1376.79367,204.230356 Z" id="Polygon-2" stroke="#2F54EB" transform="translate(1375.061784, 208.008801) rotate(40.000000) translate(-1375.061784, -208.008801) " /></g>,
  <rect id="Rectangle-14" strokeOpacity="0.4" stroke="#1D39C4" transform="translate(949.801502, 129.801502) rotate(30.000000) translate(-949.801502, -129.801502) " x="942.626304" y="222.626304" width="14.3503946" height="14.3503946" rx="1" />,
  <rect id="Rectangle-14" stroke="#CED4D9" transform="translate(111.673081, 158.673081) rotate(30.000000) translate(-111.673081, -158.673081) " x="107.288047" y="254.288047" width="8.77006914" height="8.77006914" rx="1" />,
];
const svgChildren = svgBgToParallax(svgBg);

const photos = [

  {
    src: 'https://lh3.googleusercontent.com/pw/ACtC-3fflFMK9o_f5h16YloNUADYhX99PogUxVX744kr7hXINBTbXdrtSDDInVznkKOf-jveb62EjQsV_W5BXBMLjnFmJTFJt5e11RdMCQs6CKFzH7r-tp8gVlAQYEEsQ-jsDXBN5UWsu_a3Vpplj4uI5qbN=w1232-h925-no?authuser=0',
    width: 4,
    height: 3,
  },
  {
    src: 'https://lh3.googleusercontent.com/pw/ACtC-3cGOzi4yoOmxI_YZQCoM032L2ufz1p4nl_KuExFAwnm2DrjLeFM_9HsUVS9Mr5ZGWVVANGX7XyBDhPVlkAztgRUibbbxyTWVRsXEyf45hdtCmwLjzfLyP7bkfZNxeuUOPiJjPsFifMTenVAQRYNIs3b=w1232-h924-no?authuser=0',
    width: 4,
    height: 3,
  },
  {
    src: 'https://lh3.googleusercontent.com/2P_ZsRdBelxD7WWl7ZhTu3MI2NV5uI7soNQzHy4id5FUpLuINCertbTQnvPj5YFLOByLJaDNSjKalwri14402DLNESz9eMsliswRKNP71AcprPYH7nHOhuJpggNsxEHESUruKJVdzVCQn7IoHL6sdAl_aYa-a6aA_pj5U66XMcyyDPXESlyR4oLY19oDUeycb2WgNx0TPUsCtuLtXeH2dps8WITo0N1-z3MQ7EaF9gf1HLiLQTSaTXu4M2hSWXRP_Ir72lSlcDfgo83yAbuWqTJU0hKeEI0P4aypC0alc71rUG1fV4T5pUfLSlJPUVmOUZgYQIfcms_5cm4xcKPuuRAVjMEA9Z1ooodl4G3uI1M-EoR01JNqfVZ7bmXkTD2SxnXDBkzpE_we7ew7nQockXhrtJzEAur2BCDytqC2XtOndOtBv2RDA50RHEOf7sgoj0_4uKCVnwBD7Jtp5iyiKrTFAirKpoDvHAT390W97LRligS2NKD3WlilhTUezx8IrBwgq7U6vbrfFhtSfCoWEU44pUmMNXU8TSJ7H5xWad652FmY7P82BqPALXSYm_jvtBzERA9Nsh84abLAO1TRrgP_pyygnKR7xEhUy3wEXWVFQLbU3gu_XVAGu7NQ0NyRuSZ7Zw1VHYyid9IQ5uLmj_rAagXz5fbLtXCJlFQFbtWJxgK9umfONfPU64e6HLhGU47kB5VY8q7m042PI-LcB59Mjftx341gN9GSyKyvHjTMHfQ=w859-h644-no',
    width: 4,
    height: 3,
  },
  {
    src: 'https://lh3.googleusercontent.com/hFERGkOXL5q47ImrGrT6RUlW_qFHdjiGsvO7IYD-cuh0nBAcFqaquFZeSxXL6vGOYYPqFPNSVoBMVl4TRSlm20cZATbGKFhTBmr8zwinrg6Qalw1LeFXirJZ6awfO3l78lpW_-3aZupuZZjEKh2EB16q9TXG-31TjUlydUA9U6Iz6TvOiRvnj4_Nb39kPVG7WgfschsHkDpGoI373iqURXqPcj37zjTiX1g87Imnp7Ck2EqXdfl2iSSXvySdrFD_6t5n2NuH7J9nhGx3g8WKJHPmLLeksIy4Bg88IV-0FFn13GIU82TSq1SGrq_WUua1xEWuTgHV6w-BU4mI09dj8HyHMQsO_bPO45GhPFDcHpA0mdsqix5dRCENgjjecGGhJDoclblD_NgOhfH32UJenYsKMj2mK8loYc_KXmBBJEh9jsspmPTrekabFaR9kf9lERZUUh_6G4TfJ-xQmwMK5o0u_IsHqv_lODrflxW0WgqF6D3lUaewFq52lgII_mMGu2448SAEFo6G0Ec3SI3HSKKMW9TlqsW5A5xK0u54MvzsC5RFlC3JTTO2EvmhAITyk1nHowIwQP-JkkIpncnZSzisRUPbZvDqjCOZW3fFkcmlPQpvQFnnI2902VuLN2DYZyDqC9bzNgQzDyAn00w_ecoxHIHfluwVdoLejKie6DCvtK-SJuZUgikv_kDviVz-8udJ6CZawHSj8RcX61PMuqsp4owDqbnoC_B9ov13APbwwO8=w1074-h805-no',
    width: 4,
    height: 3,
  },
  {
    src: 'https://lh3.googleusercontent.com/_B2_PWCqFBI7pRjswGMpLRRAN8vDLMfScjctEELnR5Ui-R3Ph1uTDnODMr4RtI-i20QGDy76WZrv3pl6CgrzXWXzqYwa4R9GNe_oTASKkfUiEI2rkqV63td6R6Ld4akK4D0u3kb5mN4CYH5t2wMIVKwuj5kECgCusa7WeBFzkG3V0Qf5WgmA_Se-9hhAzFPQohOZO_scHcjjo24y8Psyw0CBAOvBpW4i7fYFw3uweXGyM_UKmU_-9_k2kDn2GUadk4QtqimQ3EKXCZfwnTh-_wCx80hEWZTVXRLE_GYs1scvAQCNUHeY4nVA2gk6xmk9DTdm57XxGjC42xPG3AMVUolrkK5uhrlAL86LiSl20r121zlzLDZGouq60yPAKlqJOJ5WsRTqbWis4zOukTs2BMNRDwSr5kr_2UhutRVjnJfrpEAMPm8oqOqoAWB7Y0eOg2fM2MnRxfENBskJykSx0Vi5TAM24oUbhXGQcvfyQWjdtIhuw0vulPKQvDM-RMJuD9YkC0GXlYx3k3UdFZtyCbUsSIk2x_230EKqxeP922DI7jkQPlp-562nkmBhAPgPFF1vhy_6i693kYPA9v1wTIlXRbhsplsWNgDHHc8XgNYEqO7FteFka9sx37VZ_E3M49sKrUMuMc19dCJMpNvIRfIgBpOPxOt95rTAuxSBuJSxpQLhJfcmAuLIZUDI7cJItTLAjN2ufqsj9PpufXmh6fuCGJTN8Fj1-Ahc2PkwEM_ATnY=w604-h805-no',
    width: 3,
    height: 4,
  },
  {
    src: 'https://lh3.googleusercontent.com/mduanrXd9_HMmg5lxgRyEpJZl5TyAloqCq-oKH3pR3Z-upIdPF78nDysN5d9Q4ECAP20xwA8L4Z9Cuj3p6MqeWAdXY2oOtI9_QEFLDWJHiWxldpCnPJYJI_oUlNi-v8Bphi4MdPMEdeTGRpwLbSo5zzSgS7URbDr8i1Y3oypI_I_Gjnn86mVBaTz04XAPCWm4fg7Lq8kCHLu6mQhk7inbi0-LG3PDC5DlBxRImfLMQdvMCknYNroqyqR50xW3ek_fKhvufz8x7WGvy_HYaAHh6_3IyIswumMLwllSAcjRb2eewdO9h49EQ0moJq3OCISirTrmBeNDEdszRUBww50hW5WTpyQLGA9xgPW_CyLBfMdF5BL3crRxmiqkEl_AnXkyyRIVcp8XadcZvfNjtLN75JHwV5HlrtKs3r2SvjDlBs1mKvcPr_kd5fDBRc9I3i0FCRDVU7VBuJE7Pj6DBno68QXPlkE4zymaRe1kMKfPrj2Kl_4chJh0a12lfyx9FDZNgKZ625GesZOW26CuWeRXmyb_3ld0v83uEiCn595CpdleTwn2KJRLFcE1tyq0yJA473oi8koqF_elXqIdpUKryeAuWnHO3VDBZuQVz4ikanvOhqaoWEiduaVxrFjRcMKdlvtrz2rP4vfNBG5_91h-4lWM2e8xoZWEp19KLtT1C5Oc6XyUkNfcg=w1209-h805-no',
    width: 800,
    height: 533,
  },
  {
    src: 'https://lh3.googleusercontent.com/gageuaxi35NUOjtLD3m8t78ciYfX_7xmh-KCM02xs471KKrHj-xfLHT2zUlAlj4nM65SsAiCaIwrE56SycnhzyMfewH8zM6dQMRWSmPJA-OMetdMbRGgD4Ldc62PyiVgA0AoOv1aTRDWgcicLGduwXSEK90KQMeszefDz-_WJpthKzGezsds5t6AtLJQflL-TCm1JOgL-hil2g-WUDFoHef1cSyP4IBq4yvH4VehfiudNzyt0MoYwFwqoYOSZOCycPG0XxwCUPFNkwzlM5U1JsOoESyxAn9DvS69hEFd6DpEnptrFH2btTo2d3oO8y8hQ1DD5eLzkQhjhE8EtEvhehCfOv6_BPcHjT6VkVdVWscDsqpwq6KDa2znp6X90UkB-FzpjVVzAhzmcH4LXcIDH9RSrYvveb_mfJZDsJgBaQq4K-zsruvwVE5t4hMe4x5UccJ5nya7gZV2jIp6PlPFNt3kaa4AFqa2NkOPV4Q8BcCG_ftQzp_MEFphfyuubysfRjPVM6gqIPo45NaHFBzqM6CmOcam5pFU_UDKNwXZBjPgKzOpA6xhALjDpWwtX4BXP3fLhfg0We-FM_kf9n-pjo5FM1cJDFMVLJ5BXRj46rrqGPVhhnvtLZ-4mHYrYKWKJNXPVsVbBYu0WGr0oQNuwJ1KMaM3jdGA74BDfaBWb8adMqnqdIfHuGy8ybUUuyye3uakZ3vmfcd3q9_vwfGKprvAEuFANsko5nuIdboKAAVgj5A=w789-h526-no',
    width: 800,
    height: 533,
  },
  {
    src: 'https://lh3.googleusercontent.com/NdT0EE6DsieuzPgI9xSuteZMJdmKQ6E8eDOL4i9I5LUhcqkX_Rl2mdTH_B8wFCSqD3jYCSu4ZCun2OVDJZpnZbp87DAUQrKlxZm-b191pBum_3aNaKrHIkUTS6jZUzT6z1IhDLGizKbkjBVzkvfboOaluV-ipvPl5ChFsXX-JlmsI03sfjvfyo4UsEFcjDuMyTxzxnm6lcU7VDod3d5l7SJhsDqlPQMTLC_094-PE_fEDqRxYIogzBM3KjNgCqblZRWu2Fo_etW3zMglKhMOkp2VhNhhJN-yHbF8UHprnfjE-C6OE_0LACrJboH-VLqJyKBg2JxbRQ7-0lgHZQZKk3AD9fXGzZu7xrjUs_FTn09yBKxJjfA5ONGaRvBou0wPw8lgUzskirYE7wx7pScgYUkrmWQxm8mEFB8E3IVfhG19RMA78za36QytdLM4UEvYCyLSqBTkFPWAtHi_efm03lJFV6Sy8Qoh_JhSAvwQUnxNsZVfNxrmfRBpZpcnit1J6vt3k4HMIVpmbl0tmDvnpEvbQLbmFJ4reiF4qWvBConp2msT9wAyXu6BN4exDvujfaMvRCSoSjNQwfwHTipAIsTT_edMeSOIjUreRJpc4gZcF_l7lbB5IxCyG9BmAt0RhQdcKtc9cPrRIump59SWwnrvNKI3v-Qeu9H960VjJNCTFcXSv797LC_CqTeMCZaO86QRrfkceCrz2f2jtYdLPv5A5Yww7QYoRahxWobMeeZ-ymI=w789-h592-no',
    width: 4,
    height: 3,
  },
  {
    src: 'https://lh3.googleusercontent.com/fiXUpE1f20rih1D7wXDIxpI3wUfD9qd5Dnn2Qp1XNu26XQuLtX6VrD-9WAiKM2wU9nHJnG1PzpFCChtYoU_Zc1TwhqEJbMBQRu3SEUyGww3lV6N30sJyq7ziYwOyjuvD6oJNQhZBoSS5ZoorLvCHw9Q32gNf2-K3cM4ID_flIECGu2C1EEYQ-J-1rZP67_0H8-DFcntkmRmk4I0ndndDMsmlSyRVjmn4MdqmmHdcYS9ksJjTpbOcVrp8RD1aK7lMrZQVfrvCQc7xcRUxusRjnhJqE9DbtlzR6A-FEDlWyRMenrQeF0X5zdKTNIzpkyAencgi1mnCbKzm4aUjt689I-sGJSUnAwDMWnU-OqD9O1JqnbWgvBDyCQJKU5Ijui2OXiUWbDs_DTQgDkG3CFvMYM-KZSguG3sZhnU6i0yPM_e4dLqUQG4qMMNB8svil5K18-E86P1n3b-wzzlZBsYFSv9TqxJP44FYWkfXob5FI4c8pDmPeYOWMAOsvliIQdoYN6VWARxsgylzBxOhRDqqUfuz029zEv-aSk6eDXY3yc4o0GVnJdKawysmynSV4dbKyDTTGMQGQr2MVgSO2orTQuRAzvCJ4c0KR3zzQCjhCm_Vnb71zBdB0_3i17Di28zPuLfRSaU-yHdP-LBInalI8SxoX76kmJmHlH9-YY1FNxEbQ-FxYbUdpv1iGny6iLj36EWvu204wYGFV6jP6r7wPJBHHjx0cgbBQCsiL603kwm7sj8=w789-h592-no',
    width: 4,
    height: 3,
  },
  {
    src: 'https://lh3.googleusercontent.com/wfop0OCl-tHrUSBB-oScOH-O58HFR5F1ZAJ5xAY29DUInK66yVNlH568iWWrITyBi5rHmsmRMMMxRuNCq6x-hlg3Ppxvd5XZGfdeHu9l5EpRcvg3LmbxlPXWQSYJuBCo-V7MGKxKsWq2-jVOsBSrV5WeXY-cQFBfarBzb_rYDWj82F-Mw9HRXh1dWQrH9lHUIlyVcAwGEOQg7LcphEzktBSd7_c9ai8ORif6JkznHf6ke1jQOPXY6o71Fy-LpY_tbHxprXIEccAxToQhoeLajhRFFaiiPnhyKjx0NKQ-zkFIPMoNg0C4m3CFYFE0w6vXpOZC-FCp6PayYluEC_WeDEgdlO8d1zCSqhtQ1BBQykQKZEVp7UwG3Z2_rP-VJXVGrFdf_tX7fed6njENx4CZylM9Do8hodA8S6NBiNr_ARllhrZRGLaflyhKWOSQ0fKCzDOCCJyesSfTnRK5dZQESmTPQVJGCYWOGsmuHNWzE24SLM8XTbql-HE02Mf62cfTPPx4h7EcmPCyKSrzecXbJlsvu66Sx_CDwcaOdzK6N3m1urmq5JKb22S41D5VOQ8IiVirsQQ6mO-RoHamVpsZ8p8i-c7iNoM0S5SCyBdaPsIr2Wh-tFZ4oVi4Z35JxZ_hFoEbjn0cHRayDUTg7QVQiP-zmkqSZ78ldbRRQ4s8iK-SOX2G9V3kKeNPu-_895c2FDIT9g2yK8Iydmh7SERyAE-VPehKXfDwH6BG5l96L0mKv4w=w1407-h937-no',
    width: 800,
    height: 533,
  },
  {
    src: 'https://lh3.googleusercontent.com/wyZ60N6tqMxtfYQkj4kJCPuvAEryweONfLWrB2WRdfdZ3RcZS_wQ8VGV5UdQUEut5zqopmRK8DNQ9XMeydXjyCElrrCog8oGXclMGB_UxU5-gDUDmOdF6cqzt-AS8QuI2nZuI073KylzoaS2-kPjyVRI0RLF_-SxNX60L1yZdGmpyPWv3UCMd45hJCSlaFlaFZpBH04dgE5za_q_BY_7c9QwS8L4NRBcd89RPAVjBzBhEMjpHmnxOYnR7W45y_4nZyuv26RNYIoA6nRvhpctJOiljuYsluoui_nNLu4y3qOD3Z3PTJkbTwe-o4BKee66EPwtfDpAZw9-Q-qaMNW1ZEjXe11oH9yZga2lRx1_TipwxHN-oaIryrsQTv4hB784gLt53DSP0y8mWHzJ-3BDs8LzjR40B-0hRpTsqmGX7xpdYK_NY9s-L35aQtj2-FGy0mjZcEAgfZ9Ad6D3ApQWLpTM3ULcWQhTWlyVkpcShlgDkgw6kOOUczuxRJtq7rnszK1QcxXbwkrzJlcjM-DhOF4S1o6DYeubD3s48nR0q_XB_UPoOI33rMZILGLPk5XqHlvKbBtLxl11kiJZvAtU_SLsxH5X9x-YSIbLZzYHR7_m7ORtvS7hSNVe6KFeOmMfpdOrgGybEI9qUXsj7gubCIrn4Q_HbcQ3X77g3KI8fdPqA5JwBwtXaXVbdZsKKLIQotxzV0GnoZkBaJAkWyIQm1iNocTpl3xnpcqtXSYQkAVbgjU=w1250-h937-no',
    width: 4,
    height: 3,
  },
  {
    src: 'https://lh3.googleusercontent.com/fdT67rIksnYr8ZnEtAvmQnpYG0njv7uCmgBG7r6FreKnbUTjKM537GeXfkmJViTPSQ60rjhJJv0rC-AH7PPXqrcHx2ZKKpC5yxS83FOAhSrrlUMum_x3GbVQ1o9hC3PMDbHYpJ4SzH8aKmfNIZLjQ2eMR0EcsaybtvRPqO7mk0PxFafwaoRqVPCrR2URhCOsygANxDO5uGYF98-f8aVXnB5za4mSb4n5S52MFRrRhzgppreYUOu1xucCt_n6SR9V7ITXvK5t0skPVXwZklP46r_Uuk6Bqj1m8r5_P-rjZFzjWRUWo3VhGBGBcvHhc_ewtegi-FnMZLEkieT7F-fBUVc5zydA9aATIOHXAJO23cT8a3CJnAxhGtZ1ezQGIfZ0W0h-l11_BVdPQyHAYqkJdUNSpp4h6l80_YifXBV7B2RenMjDNiSIxU5DgIgB7BP1pE9ctoPIUiIXroQstLpFo9H2_1posCTW4Rb7XYwDunubYUlIK7FEEGLn2vuNTzRRsLZgiPZDw7Rbaw0f0Qt-hLxffkNlF7iRfHxZjN-NxbySGJe04Rfh_U-i7t051x99UjNJvXStypUdJ-q9IV5O2O6frNKBZN0fvptzQ_1j4ZSk6DD2CbbBAluwCMy0-oP7MMSYZ6TCGMcZF_UusaP-KXjIe8Fnq2WjvkRjhJHhewelON0nYxZMygEuAYOG__21JpP4YX1YJgFfaupwefUdCh5qG16jSIPs3qmlE2xnyw82n08=w1407-h937-no',
    width: 800,
    height: 533,
  },
  {
    src: 'https://lh3.googleusercontent.com/pw/ACtC-3caZkc1OMRK5szmExMCrs-sQeIc-_pxXjhB2W7DrwliMdOztoIOK3KzBgyXY4rS3TipTvlFFvJKWUvyW1GAk7xjiR1NlkrWamUNeF1vTU_-gmh5REyMXxCEJhdH52QGwxYqdqrqnTU4GBVqXf22eAd6=w1232-h924-no?authuser=0',
    width: 4,
    height: 3,
  },
];

export default function Page3(): ReactElement {
  return (
    <div className="home-page-wrapper page3" id="page3">
      <div className="parallax-bg top">
        <svg width="1440px" height="557px" viewBox="0 0 1440 557" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          {svgChildren}
        </svg>
      </div>
      <div className="page">
        <ScrollOverPack location="page3">
          <QueueAnim key="queue" component={Row} type="bottom" leaveReverse>
            <Gallery photos={photos} />
          </QueueAnim>
        </ScrollOverPack>
      </div>
    </div>
  );
}
