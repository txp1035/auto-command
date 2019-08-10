import React, { PureComponent } from 'react';

export interface BaiDuMapProps {
  address: string | { x: number; y: number };
  onChange: Function;
}

export default class BaiDuMap extends PureComponent<BaiDuMapProps> {
  componentDidMount() {
    this.heightEqWidth();
    this.MP('PjH27Aq4gNZpxMeQIze3Gu5ELSlkWBtP');
  }

  componentDidUpdate() {
    this.MP('PjH27Aq4gNZpxMeQIze3Gu5ELSlkWBtP');
  }

  draw = (BMap: any) => {
    /* 创建地图实例 */
    const map = new BMap.Map('baiduMaps');
    /* 方法封装 */
    function addMarker(points: any) {
      const marker = new BMap.Marker(points); // 创建标注
      map.addOverlay(marker); // 将标注添加到地图中
    } // 添加标注
    function geocoder(params: any, type: any, callback: any) {
      const myGeo = new BMap.Geocoder();
      if (type === '中文地址') {
        myGeo.getPoint(params, (myGeoPoint: any) => {
          if (myGeoPoint) {
            callback(myGeoPoint);
          } else {
            console.log('您选择地址没有解析到结果!');
          }
        });
      } else if (type === '点坐标') {
        myGeo.getLocation(params, (rs: any) => {
          const addComp = rs.addressComponents;
          callback(addComp);
        });
      }
    }
    const { address = '四川省成都市' } = this.props;
    if (Object.prototype.toString.call(address) === '[object String]') {
      geocoder(address, '中文地址', (value: any) => {
        map.centerAndZoom(value, 15);
        geocoder(value, '点坐标', (values: any) => {
          if (this.props.onChange) {
            this.props.onChange(values, value, 'init');
          }
        });
        addMarker(value);
      });
    } else if (Object.prototype.toString.call(address) === '[object Object]') {
      /* 创建点坐标 */
      const point = new BMap.Point(address.x, address.y);
      /* 初始化地图,设置中心点坐标和地图级别 */
      map.centerAndZoom(point, 15);
    }

    map.addEventListener('click', (e: any) => {
      map.clearOverlays(); // 清除地图上所有覆盖物
      addMarker(e.point);
      map.panTo(new BMap.Point(e.point.lng, e.point.lat)); // 将地图的中心点更改为给定的点。
      geocoder(e.point, '点坐标', (value: any) => {
        if (this.props.onChange) {
          this.props.onChange(value, e.point, 'click');
        }
      });
    }); // 地图点击事件
    /* 添加定位控件 */
    const geolocationControl = new BMap.GeolocationControl();
    geolocationControl.addEventListener('locationSuccess', (e: any) => {
      // 定位成功事件
      addMarker(e.point);
    });
    geolocationControl.addEventListener('locationError', (e: any) => {
      // 定位失败事件
      console.log(e.message);
    });
    map.addControl(geolocationControl);
    /* 添加定位控件 */
    map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
  };

  heightEqWidth = () => {
    const dom = document.getElementById('baiduMaps');
    (dom as HTMLElement).style.height = `${(dom as HTMLElement).offsetWidth}px`;
  }; // 设置高度等于宽度

  // 添加head头脚本
  MP = (ak: string) => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.dataset.name = 'map';
    script.src = `https://api.map.baidu.com/api?v=2.0&ak=${ak}`; // callback调用init函数。
    document.head.appendChild(script);
    this.draw(window.BMap);
  };

  render() {
    return <div id="baiduMaps"></div>;
  }
}
