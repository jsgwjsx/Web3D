// src/router/index.ts

import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';


const routes: Array<RouteRecordRaw> = [
  {
    path: '',
    name: 'init',
    redirect: '/page'
  },
  {
    path: '/TollBath',
    name: 'TollBath_examples',
    component: () => import('../view/Example/Basic_01/index.vue')
  },
  {
    path: '/Map',
    name: 'Map_examples',
    component: () => import('../view/Example/Basic_06_world/index.vue')
  },
  {
    path: '/ChinaMap',
    name: 'Map_china',
    component: () => import('../view/Example/Basic_06_china/index.vue')
  },  
  {
    path: '/ChinaCir',
    name: 'china_Cir',
    component: () => import('../view/Example/Basic_06_chinaCir/index.vue')
  },  
  {
    path: '/ChinaPot',
    name: 'china_Pot',
    component: () => import('../view/Example/Basic_06_chinaPot/index.vue')
  },  
  {
    path: '/ChinaCyl',
    name: 'china_Cyl',
    component: () => import('../view/Example/Basic_06_chinaCyl/index.vue')
  },  
  {
    path: '/flyLine',
    name: 'china_flyLine',
    component: () => import('../view/Example/Basic_06_flyLine/index.vue')
  },  
  {
    path: '/henanMap',
    name: 'Map_henan',
    component: () => import('../view/Example/Basic_06_henan/index.vue')
  },
  {
    path: '/Earth',
    name: 'earth',
    component: () => import('../view/Example/Basic_07_01/index.vue')
  },
  {
    path: '/EarthMark',
    name: 'earthmark',
    component: () => import('../view/Example/Basic_07_02/index.vue')
  },
  {
    path: '/EarthMesh',
    name: 'earthmesh',
    component: () => import('../view/Example/Basic_07_03/index.vue')
  },

  {
    path: '/EarthPoint',
    name: 'earthPoint',
    component: () => import('../view/Example/Basic_07_04/index.vue')
  },
  {
    path: '/Earthpop',
    name: 'earthpop',
    component: () => import('../view/Example/Basic_07_05/index.vue')
  },
  {
    path: '/EarthFly',
    name: 'earthFly',
    component: () => import('../view/Example/Basic_07_06/index.vue')
  },
  {
    path: '/City',
    name: 'City',
    component: () => import('../view/Example/Basic_08/index.vue')
  },
  {
    path: '/Roam',
    name: 'Roam',
    component: () => import('../view/Example/Basic_02/index.vue')
  },
  {
    path: '/Things',
    name: 'Things',
    component: () => import('../view/Example/Basic_03/index.vue')
  },
  {
    path: '/Phone',
    name: 'Phone',
    component: () => import('../view/Example/Basic_04/index.vue')
  },
  {
    path: '/Car',
    name: 'Car',
    component: () => import('../view/Example/Basic_05/index.vue')
  },
  {
    path: '/examples',
    name: 'example',
    component: () => import('../Example.vue'),
    children: [
      {
        path: '',
        name: 'basic_00',
        redirect: '/examples/01'
      },
      {
        path: '01',
        name: 'basic_01',
        component: () => import('../view/Example/Basic.vue')
      },
    ]
  },
  {
    path: '/Cesium',
    name: 'Cesium',
    component: () => import('../Cesium.vue'),
    children: [
      {
        path: '',
        name: 'Cesium_00',
        redirect: '/Cesium/01'
      },
      {
        path: '01',
        name: 'Cesium_01',
        component: () => import('../view/Cesium/01.vue')
      },
      {
        path: '02',
        name: 'Cesium_02',
        component: () => import('../view/Cesium/02.vue')
      },
      {
        path: '03',
        name: 'Cesium_03',
        component: () => import('../view/Cesium/03.vue')
      },
      {
        path: '04',
        name: 'Cesium_04',
        component: () => import('../view/Cesium/04.vue')
      },
      {
        path: '05',
        name: 'Cesium_05',
        component: () => import('../view/Cesium/05.vue')
      },
      {
        path: '06',
        name: 'Cesium_06',
        component: () => import('../view/Cesium/06.vue')
      },
      {
        path: '07',
        name: 'Cesium_07',
        component: () =>import('../view/Cesium/07 .vue')
      },
      {
        path: '08',
        name: 'Cesium_08',
        component: () =>import('../view/Cesium/08.vue')
      },
      {
        path: '09',
        name: 'Cesium_09',
        component: () =>import('../view/Cesium/09.vue')
      },
      {
        path: '10',
        name: 'Cesium_10',
        component: () =>import('../view/Cesium/10.vue')
      },
      {
        path: '11',
        name: 'Cesium_11',
        component: () =>import('../view/Cesium/11 .vue')
      },
      {
        path: '12',
        name: 'Cesium_12',
        component: () =>import('../view/Cesium/12 .vue')
      },
      {
        path: '13',
        name: 'Cesium_13',
        component: () =>import('../view/Cesium/13.vue')
      },
      {
        path: '14',
        name: 'Cesium_14',
        component: () =>import('../view/Cesium/14.vue')
      },
      {
        path: '15',
        name: 'Cesium_15',
        component: () =>import('../view/Cesium/15.vue')
      },
      {
        path: '16',
        name: 'Cesium_16',
        component: () =>import('../view/Cesium/16.vue')
      },
      {
        path: '17',
        name: 'Cesium_17',
        component: () =>import('../view/Cesium/17.vue')
      },
      {
        path: '18',
        name: 'Cesium_18',
        component: () =>import('../view/Cesium/18.vue')
      },
      {
        path: '19',
        name: 'Cesium_19',
        component: () =>import('../view/Cesium/19.vue')
      },
      {
        path: '20',
        name: 'Cesium_20',
        component: () =>import('../view/Cesium/20.vue')
      },
      {
        path: '21',
        name: 'Cesium_21',
        component: () =>import('../view/Cesium/21.vue')
      },
      {
        path: '22',
        name: 'Cesium_22',
        component: () =>import('../view/Cesium/22.vue')
      },
      {
        path: '23',
        name: 'Cesium_23',
        component: () =>import('../view/Cesium/23.vue')
      },
      {
        path: '24',
        name: 'Cesium_24',
        component: () =>import('../view/Cesium/24.vue')
      },
      {
        path: '25',
        name: 'Cesium_25',
        component: () =>import('../view/Cesium/25.vue')
      },
      {
        path: '26',
        name: 'Cesium_26',
        component: () =>import('../view/Cesium/26.vue')
      },
      {
        path: '27',
        name: 'Cesium_27',
        component: () =>import('../view/Cesium/27.vue')
      },
      {
        path: '28',
        name: 'Cesium_28',
        component: () =>import('../view/Cesium/28.vue')
      },
      {
        path: '29',
        name: 'Cesium_29',
        component: () =>import('../view/Cesium/29.vue')
      },
      {
        path: '30',
        name: 'Cesium_30',
        component: () =>import('../view/Cesium/30.vue')
      },
      {
        path: '31',
        name: 'Cesium_31',
        component: () =>import('../view/Cesium/31.vue')
      },
      {
        path: '32',
        name: 'Cesium_32',
        component: () =>import('../view/Cesium/32.vue')
      },
      {
        path: '33',
        name: 'Cesium_33',
        component: () =>import('../view/Cesium/33.vue')
      },
      {
        path: '34',
        name: 'Cesium_34',
        component: () =>import('../view/Cesium/34.vue')
      },
      {
        path: '35',
        name: 'Cesium_35',
        component: () =>import('../view/Cesium/35.vue')
      },
      {
        path: '36',
        name: 'Cesium_36',
        component: () =>import('../view/Cesium/36.vue')
      },
      {
        path: '37',
        name: 'Cesium_37',
        component: () =>import('../view/Cesium/37.vue')
      },
      {
        path: '38',
        name: 'Cesium_38',
        component: () =>import('../view/Cesium/38.vue')
      },
      {
        path: '39',
        name: 'Cesium_39',
        component: () =>import('../view/Cesium/39.vue')
      },
      {
        path: '40',
        name: 'Cesium_40',
        component: () =>import('../view/Cesium/40.vue')
      },
      {
        path: '41',
        name: 'Cesium_41',
        component: () =>import('../view/Cesium/41.vue')
      },
      {
        path: '42',
        name: 'Cesium_42',
        component: () =>import('../view/Cesium/42.vue')
      },
      {
        path: '43',
        name: 'Cesium_43',
        component: () =>import('../view/Cesium/43.vue')
      },
      {
        path: '44',
        name: 'Cesium_44',
        component: () =>import('../view/Cesium/44.vue')
      },
      {
        path: '45',
        name: 'Cesium_45',
        component: () =>import('../view/Cesium/45.vue')
      },
      {
        path: '46',
        name: 'Cesium_46',
        component: () =>import('../view/Cesium/46.vue')
      },
      {
        path: '47',
        name: 'Cesium_47',
        component: () =>import('../view/Cesium/47.vue')
      },
      {
        path: '48',
        name: 'Cesium_48',
        component: () =>import('../view/Cesium/48.vue')
      },
      {
        path: '49',
        name: 'Cesium_49',
        component: () =>import('../view/Cesium/49.vue')
      },
      {
        path: '50',
        name: 'Cesium_50',
        component: () =>import('../view/Cesium/50.vue')
      },
      {
        path: '51',
        name: 'Cesium_51',
        component: () =>import('../view/Cesium/51 .vue')
      },
      {
        path: '52',
        name: 'Cesium_52',
        component: () =>import('../view/Cesium/52.vue')
      },
      {
        path: '53',
        name: 'Cesium_53',
        component: () =>import('../view/Cesium/53.vue')
      },
      {
        path: '54',
        name: 'Cesium_54',
        component: () =>import('../view/Cesium/54.vue')
      },
      {
        path: '55',
        name: 'Cesium_55',
        component: () =>import('../view/Cesium/55.vue')
      },
      {
        path: '56',
        name: 'Cesium_56',
        component: () =>import('../view/Cesium/56.vue')
      },
      {
        path: '57',
        name: 'Cesium_57',
        component: () =>import('../view/Cesium/57.vue')
      },
      {
        path: '58',
        name: 'Cesium_58',
        component: () =>import('../view/Cesium/58.vue')
      },
      {
        path: '59',
        name: 'Cesium_59',
        component: () =>import('../view/Cesium/59.vue')
      },
      {
        path: '60',
        name: 'Cesium_60',
        component: () =>import('../view/Cesium/60.vue')
      },
      {
        path: '61',
        name: 'Cesium_61',
        component: () =>import('../view/Cesium/61.vue')
      },
      {
        path: '62',
        name: 'Cesium_62',
        component: () =>import('../view/Cesium/62.vue')
      },
      {
        path: '63',
        name: 'Cesium_63',
        component: () =>import('../view/Cesium/63.vue')
      },
      {
        path: '64',
        name: 'Cesium_64',
        component: () =>import('../view/Cesium/64.vue')
      },
      {
        path: '65',
        name: 'Cesium_65',
        component: () =>import('../view/Cesium/65.vue')
      },
      {
        path: '66',
        name: 'Cesium_66',
        component: () =>import('../view/Cesium/66.vue')
      },
      {
        path: '67',
        name: 'Cesium_67',
        component: () =>import('../view/Cesium/67.vue')
      },
      {
        path: '68',
        name: 'Cesium_68',
        component: () =>import('../view/Cesium/68.vue')
      },
      {
        path: '69',
        name: 'Cesium_69',
        component: () =>import('../view/Cesium/69.vue')
      },
      {
        path: '70',
        name: 'Cesium_70',
        component: () =>import('../view/Cesium/70.vue')
      },
      {
        path: '71',
        name: 'Cesium_71',
        component: () =>import('../view/Cesium/71.vue')
      },
      {
        path: '72',
        name: 'Cesium_72',
        component: () =>import('../view/Cesium/72.vue')
      },
      {
        path: '73',
        name: 'Cesium_73',
        component: () =>import('../view/Cesium/73.vue')
      },
      {
        path: '74',
        name: 'Cesium_74',
        component: () =>import('../view/Cesium/74.vue')
      },
      {
        path: '75',
        name: 'Cesium_75',
        component: () =>import('../view/Cesium/75.vue')
      },
      {
        path: '76',
        name: 'Cesium_76',
        component: () =>import('../view/Cesium/76.vue')
      },
      {
        path: '77',
        name: 'Cesium_77',
        component: () =>import('../view/Cesium/77.vue')
      },
      {
        path: '78',
        name: 'Cesium_78',
        component: () =>import('../view/Cesium/78.vue')
      },
      {
        path: '79',
        name: 'Cesium_79',
        component: () =>import('../view/Cesium/79.vue')
      },
      {
        path: '80',
        name: 'Cesium_80',
        component: () =>import('../view/Cesium/80 .vue')
      },
      {
        path: '81',
        name: 'Cesium_81',
        component: () =>import('../view/Cesium/81.vue')
      },
      {
        path: '82',
        name: 'Cesium_82',
        component: () =>import('../view/Cesium/82.vue')
      },
      {
        path: '83',
        name: 'Cesium_83',
        component: () =>import('../view/Cesium/83.vue')
      },
      {
        path: '84',
        name: 'Cesium_84',
        component: () =>import('../view/Cesium/84.vue')
      },
      {
        path: '85',
        name: 'Cesium_85',
        component: () =>import('../view/Cesium/85.vue')
      },
      {
        path: '86',
        name: 'Cesium_86',
        component: () =>import('../view/Cesium/86.vue')
      },
      {
        path: '87',
        name: 'Cesium_87',
        component: () =>import('../view/Cesium/87.vue')
      },
      {
        path: '88',
        name: 'Cesium_88',
        component: () =>import('../view/Cesium/88.vue')
      },
      {
        path: '89',
        name: 'Cesium_89',
        component: () =>import('../view/Cesium/89.vue')
      },
      {
        path: '90',
        name: 'Cesium_90',
        component: () =>import('../view/Cesium/90.vue')
      },
      {
        path: '91',
        name: 'Cesium_91',
        component: () =>import('../view/Cesium/91.vue')
      },
      {
        path: '92',
        name: 'Cesium_92',
        component: () =>import('../view/Cesium/92.vue')
      },
      {
        path: '93',
        name: 'Cesium_93',
        component: () =>import('../view/Cesium/93.vue')
      },
      {
        path: '94',
        name: 'Cesium_94',
        component: () =>import('../view/Cesium/94.vue')
      },
      {
        path: '95',
        name: 'Cesium_95',
        component: () =>import('../view/Cesium/95.vue')
      },
      {
        path: '96',
        name: 'Cesium_96',
        component: () =>import('../view/Cesium/96.vue')
      },
      {
        path: '97',
        name: 'Cesium_97',
        component: () =>import('../view/Cesium/97.vue')
      },
      {
        path: '98',
        name: 'Cesium_98',
        component: () =>import('../view/Cesium/98.vue')
      },
      {
        path: '99',
        name: 'Cesium_99',
        component: () =>import('../view/Cesium/99.vue')
      },
    ]
  },
  {
    path: '/webgl',
    name: 'webgl',
    component: () => import('../Webgl.vue'),
    children: [
      {
        path: '',
        name: 'webgl00',
        redirect: '/webgl/01'
      },
      {
        path: '01',
        name: 'webgl01',
        component: () => import('../view/Webgl/1.abs.vue')
      },
      {
        path: '02',
        name: 'webgl02',
        component: () => import('../view/Webgl/2.sign.vue')
      },
      {
        path: '03',
        name: 'webgl03',
        component: () => import('../view/Webgl/3.Ceil.vue')
      },
      {
        path: '04',
        name: 'webgl04',
        component: () => import('../view/Webgl/4.floor.vue')
      },
      {
        path: '05',
        name: 'webgl05',
        component: () => import('../view/Webgl/5.smothstep.vue')
      },
      {
        path: '06',
        name: 'webgl06',
        component: () => import('../view/Webgl/6.step.vue')
      },
      {
        path: '07',
        name: 'webgl07',
        component: () => import('../view/Webgl/7.min.vue')
      },
      {
        path: '08',
        name: 'webgl08',
        component: () => import('../view/Webgl/8.max.vue')
      },
      {
        path: '09',
        name: 'webgl09',
        component: () => import('../view/Webgl/9.mod.vue')
      },
      {
        path: '10',
        name: 'webgl10',
        component: () => import('../view/Webgl/10.mix.vue')
      },
      {
        path: '11',
        name: 'webgl11',
        component: () => import('../view/Webgl/11.clamp.vue')
      },
      {
        path: '12',
        name: 'webgl12',
        component: () => import('../view/Webgl/12.fract.vue')
      },
      {
        path: '13',
        name: 'webgl13',
        component: () => import('../view/Webgl/13.radians_and_degree.vue')
      },
      {
        path: '14',
        name: 'webgl14',
        component: () => import('../view/Webgl/14.sin_and_cos.vue')
      },
      {
        path: '15',
        name: 'webgl15',
        component: () => import('../view/Webgl/15.tan.vue')
      },
      {
        path: '16',
        name: 'webgl16',
        component: () => import('../view/Webgl/16.asin_and_acos.vue')
      },
      {
        path: '17',
        name: 'webgl17',
        component: () => import('../view/Webgl/17.atan.vue')
      },
      {
        path: '18',
        name: 'webgl18',
        component: () => import('../view/Webgl/18.Trigonometry_example1.vue')
      },
      {
        path: '19',
        name: 'webgl19',
        component: () => import('../view/Webgl/19.Trigonometry_example2.vue')
      },
      {
        path: '20',
        name: 'webgl20',
        component: () => import('../view/Webgl/20.length_and_distance.vue')
      },
      {
        path: '21',
        name: 'webgl21',
        component: () => import('../view/Webgl/21.pow.vue')
      },
      {
        path: '22',
        name: 'webgl22',
        component: () => import('../view/Webgl/22.exp.vue')
      },
      {
        path: '23',
        name: 'webgl23',
        component: () => import('../view/Webgl/23.vec.vue')
      },
      {
        path: '24',
        name: 'webgl24',
        component: () => import('../view/Webgl/24.tansform.vue')
      },
      {
        path: '25',
        name: 'webgl25',
        component: () => import('../view/Webgl/25.rotate.vue')
      },
      {
        path: '26',
        name: 'webgl26',
        component: () => import('../view/Webgl/26.scale.vue')
      },
      {
        path: '27',
        name: 'webgl27',
        component: () => import('../view/Webgl/27.Matrix.vue')
      },
      {
        path: '28',
        name: 'webgl28',
        component: () => import('../view/Webgl/28.random.vue')
      },
      {
        path: '29',
        name: 'webgl29',
        component: () => import('../view/Webgl/29.noises.vue')
      },
      {
        path: '30',
        name: 'webgl30',
        component: () => import('../view/Webgl/30.subtype.vue')
      },
      {
        path: '31',
        name: 'webgl31',
        component: () => import('../view/Webgl/31.coodinates.vue')
      },
      {
        path: '32',
        name: 'webgl32',
        component: () => import('../view/Webgl/example/fire.vue')
      },
      {
        path: '33',
        name: 'webgl33',
        component: () => import('../view/Webgl/example/radar.vue')
      },
      {
        path: '34',
        name: 'webgl34',
        component: () => import('../view/Webgl/example/dreamland.vue')
      },
      {
        path: '35',
        name: 'webgl35',
        component: () => import('../view/Webgl/example/red_flag.vue')
      },
      {
        path: '36',
        name: 'webgl36',
        component: () => import('../view/Webgl/example/battery.vue')
      },
      {
        path: '37',
        name: 'webgl37',
        component: () => import('../view/Webgl/example/sea.vue')
      },
      {
        path: '38',
        name: 'webgl38',
        component: () => import('../view/Webgl/example/rain.vue')
      },
      
    ]
  },
  {
    path: '/page',
    name: 'page',
    component: () => import('../Page.vue'),
    children: [
      {
        path: '',
        name: '01.initScene',
        redirect: '/page/01'
      },
      {
        path: '01',
        name: 'basic',
        component: () => import('../view/1_basic/01.vue')
      },
      {
        path: '02',
        name: '3d_space',
        component: () => import('../view/1_basic/02.vue')
      },
      {
        path: '03',
        name: 'meshmaterial_influenced_light',
        component: () => import('../view/1_basic/03.vue')
      },
      {
        path: '04',
        name: 'orbitControls',
        component: () => import('../view/1_basic/04.vue')
      },
      {
        path: '05',
        name: 'AmbientLight_and_DirectionalLight',
        component: () => import('../view/1_basic/05.vue')
      },
      {
        path: '06',
        name: 'animationFrame',
        component: () => import('../view/1_basic/06.vue')
      },
      {
        path: '07',
        name: 'canvasResize',
        component: () => import('../view/1_basic/07.vue')
      },
      {
        path: '08',
        name: 'Stats',
        component: () => import('../view/1_basic/08.vue')
      },
      {
        path: '09',
        name: 'Geometry',
        component: () => import('../view/1_basic/09.vue')
      },
      {
        path: '10',
        name: 'RenderSetting',
        component: () => import('../view/1_basic/10.vue')
      },
      {
        path: '11',
        name: 'gui_js',
        component: () => import('../view/1_basic/11.vue')
      },
      {
        path: '12',
        name: 'BufferGeometry_Points',
        component: () => import('../view/2_buffergeometry/01.vue')
      },
      {
        path: '13',
        name: 'LineObject',
        component: () => import('../view/2_buffergeometry/02.vue')
      },
      {
        path: '14',
        name: 'MeshObject',
        component: () => import('../view/2_buffergeometry/03.vue')
      },
      {
        path: '15',
        name: 'Index_Buffer',
        component: () => import('../view/2_buffergeometry/04.vue')
      },
      {
        path: '16',
        name: 'geometry_transform',
        component: () => import('../view/2_buffergeometry/05.vue')
      },
      {
        path: '17',
        name: 'Modelobj_Position',
        component: () => import('../view/3_modelobj_Material/01.vue')
      },
      {
        path: '18',
        name: 'Rotation_Quaternion',
        component: () => import('../view/3_modelobj_Material/02.vue')
      },
      {
        path: '19',
        name: 'ObjAttribute_ObjFunction',
        component: () => import('../view/3_modelobj_Material/03.vue')
      },
      {
        path: '20',
        name: 'ObjGroup',
        component: () => import('../view/4_Multilevel_model/01.vue')
      },
      {
        path: '21',
        name: '3dPosition_partposition',
        component: () => import('../view/4_Multilevel_model/02.vue')
      },
      {
        path: '22',
        name: 'uv_texture',
        component: () => import('../view/5.uvs_textures/01.vue')
      },
      {
        path: '23',
        name: 'texture_Array',
        component: () => import('../view/5.uvs_textures/02.vue')
      },
      {
        path: '24',
        name: 'texture_Animation',
        component: () => import('../view/5.uvs_textures/03.vue')
      },
      {
        path: '25',
        name: 'gltf_import',
        component: () => import('../view/6.model_importGLTF/01.vue')
      },
      {
        path: '26',
        name: 'gltf_traverse',
        component: () => import('../view/6.model_importGLTF/02.vue')
      },
      {
        path: '27',
        name: 'gltf_render_encoding',
        component: () => import('../view/6.model_importGLTF/03.vue')
      },
      {
        path: '28',
        name: 'gltf_texture_edit',
        component: () => import('../view/6.model_importGLTF/04.vue')
      },
      {
        path: '29',
        name: 'PRB_material',
        component: () => import('../view/7.PRB_material/01.vue')
      },
      {
        path: '30',
        name: 'PRB_envAndscene_env',
        component: () => import('../view/7.PRB_material/02.vue')
      },
      {
        path: '31',
        name: 'PRB_meshPhysicalmaterial',
        component: () => import('../view/7.PRB_material/03.vue')
      },
      {
        path: '32',
        name: 'render_ui_inturn',
        component: () => import('../view/8.render_ui/01.vue')
      },
      {
        path: '33',
        name: 'canvas_download',
        component: () => import('../view/8.render_ui/02.vue')
      },
      {
        path: '34',
        name: 'gltf_progress',
        component: () => import('../view/8.render_ui/03.vue')
      },
      {
        path: '35',
        name: 'arc_points',
        component: () => import('../view/9.curve_geometry/01.vue')
      },
      {
        path: '36',
        name: 'curve_points',
        component: () => import('../view/9.curve_geometry/02.vue')
      },
      {
        path: '37',
        name: 'circle_ellipse',
        component: () => import('../view/9.curve_geometry/03.vue')
      }
      , {
        path: '38',
        name: 'splineCurve',
        component: () => import('../view/9.curve_geometry/04.vue')
      }
      , {
        path: '39',
        name: 'BezierCurve',
        component: () => import('../view/9.curve_geometry/05.vue')
      }
      , {
        path: '40',
        name: 'CurvePath_line',
        component: () => import('../view/9.curve_geometry/06.vue')
      }
      ,
      {
        path: '41',
        name: 'Cube',
        component: () => import('../view/9.curve_geometry/07.vue')
      }
      ,
      {
        path: '42',
        name: 'Lathe',
        component: () => import('../view/9.curve_geometry/08.vue')
      }
      ,
      {
        path: '43',
        name: 'ShapeGeometry',
        component: () => import('../view/9.curve_geometry/09.vue')
      }
      ,
      {
        path: '44',
        name: 'ExtrudeGeometry',
        component: () => import('../view/9.curve_geometry/10.vue')
      }
      ,
      {
        path: '45',
        name: 'Shape_API',
        component: () => import('../view/9.curve_geometry/11.vue')
      }
      ,
      {
        path: '46',
        name: 'Shape_holes',
        component: () => import('../view/9.curve_geometry/12.vue')
      }
      ,
      {
        path: '47',
        name: 'edges',
        component: () => import('../view/9.curve_geometry/13.vue')
      }
      ,
      {
        path: '48',
        name: 'color_gradient',
        component: () => import('../view/9.curve_geometry/14.vue')
      }
      ,
      {
        path: '49',
        name: 'gltf_grade',
        component: () => import('../view/9.curve_geometry/15.vue')
      }
      ,
      {
        path: '50',
        name: 'OrathographicCamera_box3',
        component: () => import('../view/10_basicCarmer/01.vue')
      }
      ,
      {
        path: '51',
        name: 'camera_animation',
        component: () => import('../view/10_basicCarmer/02.vue')
      }
      ,
      {
        path: '52',
        name: 'around_view',
        component: () => import('../view/10_basicCarmer/03.vue')
      }
      ,
      {
        path: '53',
        name: 'tube_moveTravel',
        component: () => import('../view/10_basicCarmer/04.vue')
      }
      ,
      {
        path: '54',
        name: 'SpotLight',
        component: () => import('../view/11_Light_Shadow/01.vue')
      }
      ,
      {
        path: '55',
        name: 'DirectionLight_Shadow',
        component: () => import('../view/11_Light_Shadow/02.vue')
      }
      ,
      {
        path: '56',
        name: 'GUI_SunlightShadow',
        component: () => import('../view/11_Light_Shadow/03.vue')
      }
      ,
      {
        path: '57',
        name: 'Sprite_texture',
        component: () => import('../view/12_Sprite/01.vue')
      }
      ,
      {
        path: '58',
        name: 'Sprite_weather',
        component: () => import('../view/12_Sprite/02.vue')
      }
      ,
      {
        path: '59',
        name: 'EffectComposer',
        component: () => import('../view/13_EffectComposer/01.vue')
      }
      ,
      {
        path: '60',
        name: 'EffectComposer_application',
        component: () => import('../view/13_EffectComposer/02.vue')
      }
      ,
      {
        path: '61',
        name: 'Ray_IntersectTriangle',
        component: () => import('../view/14_Ray/01.vue')
      }
      ,
      {
        path: '62',
        name: 'Ray_Caster',
        component: () => import('../view/14_Ray/02.vue')
      }
      ,
      {
        path: '63',
        name: 'RayCaster_model',
        component: () => import('../view/14_Ray/03.vue')
      }
      ,
      {
        path: '64',
        name: 'RayCaster_Sprite',
        component: () => import('../view/14_Ray/04.vue')
      }
      ,
      {
        path: '65',
        name: 'css2Renderer',
        component: () => import('../view/15_cssXRenderer/01.vue')
      }
      ,
      {
        path: '66',
        name: 'css2Renderer_Ray',
        component: () => import('../view/15_cssXRenderer/02.vue')
      }
      ,
      {
        path: '67',
        name: 'css3Renderer',
        component: () => import('../view/15_cssXRenderer/03.vue')
      }
      ,
      {
        path: '68',
        name: 'css3_for',
        component: () => import('../view/15_cssXRenderer/04.vue')
      }
      ,
      {
        path: '69',
        name: 'Animation',
        component: () => import('../view/16_Animation/01.vue')
      }
      ,
      {
        path: '70',
        name: 'GLTF_Animation',
        component: () => import('../view/16_Animation/02.vue')
      }
      ,
      {
        path: '71',
        name: 'Deform',
        component: () => import('../view/16_Animation/03.vue')
      }
      ,
      {
        path: '72',
        name: 'Deform_people',
        component: () => import('../view/16_Animation/04.vue')
      }
      ,
      {
        path: '73',
        name: 'Bone',
        component: () => import('../view/16_Animation/05.vue')
      }
      ,
      {
        path: '74',
        name: 'Bone_Animation',
        component: () => import('../view/16_Animation/06.vue')
      }
      ,
      {
        path: '75',
        name: 'tween',
        component: () => import('../view/17_tweenjs_Animation/01.vue')
      }
      ,
      {
        path: '76',
        name: 'tween_application',
        component: () => import('../view/17_tweenjs_Animation/02.vue')
      }
      ,
      {
        path: '77',
        name: 'Math_triangleFun',
        component: () => import('../view/18_Math_calaulations/01.vue')
      }
      ,
      {
        path: '78',
        name: 'camera_direction_calculation',
        component: () => import('../view/18_Math_calaulations/02.vue')
      }
      ,
      {
        path: '79',
        name: 'normal_visiblity',
        component: () => import('../view/18_Math_calaulations/03.vue')
      }
      ,
      {
        path: '80',
        name: 'constant_speed',
        component: () => import('../view/18_Math_calaulations/04.vue')
      }
      ,
      {
        path: '81',
        name: 'add_speed',
        component: () => import('../view/18_Math_calaulations/05.vue')
      }
      ,
      {
        path: '82',
        name: 'dot_attainangle',
        component: () => import('../view/19_Vec_dot_cross/01.vue')
      }
      ,
      {
        path: '83',
        name: 'judge_around',
        component: () => import('../view/19_Vec_dot_cross/02.vue')
      }
      ,
      {
        path: '84',
        name: 'judge_sector',
        component: () => import('../view/19_Vec_dot_cross/03.vue')
      }
      ,
      {
        path: '85',
        name: 'judge_parallel',
        component: () => import('../view/19_Vec_dot_cross/04.vue')
      }
      ,
      {
        path: '86',
        name: 'judge_leftOrright',
        component: () => import('../view/19_Vec_dot_cross/05.vue')
      }
      ,
      {
        path: '87',
        name: 'judge_ifoneSide',
        component: () => import('../view/19_Vec_dot_cross/06.vue')
      }
      ,
      {
        path: '88',
        name: 'Triangle_Area',
        component: () => import('../view/19_Vec_dot_cross/07.vue')
      }
      ,
      {
        path: '89',
        name: 'Triangle_H',
        component: () => import('../view/19_Vec_dot_cross/08.vue')
      }
      ,
      {
        path: '90',
        name: 'Euler',
        component: () => import('../view/20_Euler_Quaternion/01.vue')
      }
      ,
      {
        path: '91',
        name: 'Quaternion',
        component: () => import('../view/20_Euler_Quaternion/02.vue')
      }
      ,
      {
        path: '92',
        name: 'Quaternion_vecRotate',
        component: () => import('../view/20_Euler_Quaternion/03.vue')
      }
      ,
      {
        path: '93',
        name: 'Matrix4',
        component: () => import('../view/21_Matrix4/01.vue')
      }
      ,
      {
        path: '94',
        name: 'Object_Matrix_MatrixWorld',
        component: () => import('../view/21_Matrix4/02.vue')
      }
      ,
      {
        path: '95',
        name: 'Octree',
        component: () => import('../view/22_Octree/01.vue')
      }
      ,
      {
        path: '96',
        name: 'Cannon-es_PingPang',
        component: () => import('../view/23_cannonjs/1.vue')
      }
      ,
      {
        path: '97',
        name: 'Cannon-es_box',
        component: () => import('../view/23_cannonjs/2.vue')
      },
      {
        path: '98',
        name: 'Cannon-es_Hedra',
        component: () => import('../view/23_cannonjs/3.vue')
      },
      {
        path: '99',
        name: 'Shader_material',
        component: () => import('../view/24_shader/01.vue')
      },
      {
        path: '100',
        name: 'Shader_Varying',
        component: () => import('../view/24_shader/02.vue')
      },
      {
        path: '101',
        name: 'Varying_position',
        component: () => import('../view/24_shader/03.vue')
      },
      {
        path: '102',
        name: 'Shader_map',
        component: () => import('../view/24_shader/04.vue')
      },
      {
        path: '103',
        name: 'Shader_attributes',
        component: () => import('../view/24_shader/05.vue')
      },
      {
        path: '104',
        name: 'Material_onBeforeCompile',
        component: () => import('../view/25_onBeforeCompile/01.vue')
      }
    ]
  }

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
let isRefreshing = false

router.afterEach(() => {
  if (isRefreshing) {
    //刷新后，自动isRefreshing = false
    window.location.reload()
  } else {
    isRefreshing = true
  }

})

export default router;