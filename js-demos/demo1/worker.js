function measure(filename) { // 创建异步请求，返回一个对象，对象中包含下载时间和尺寸信息
  var xhr = new XMLHttpRequest();
  var measure = {};
  xhr.open("GET", filename + '?' + (new Date()).getTime(), false);
  measure.start = (new Date()).getTime();
  xhr.send(null);
  if (xhr.status == 200) {
    measure.end = (new Date()).getTime();
    measure.delta = measure.end - measure.start;
    measure.message = '';
  } else {
    measure.message = `网站访问错误，状态码: ${xhr.status}`;
    measure.delta = -1;
  }
  // measure.len = parseInt(xhr.getResponseHeader('Content-Length') || xhr.responseText.length || 0);
  measure.len = parseInt(xhr.responseText.length || 0);
  return measure;
}

onmessage = function(e) {
  var len = e.data.url.length;
  var arr = [];
  for (var i = 0; i < len; i++) {
    arr[i] = measure(e.data.url[i]);
    arr[i].url = e.data.url[i];
  }

  var deltaArr = [], msgArr = [];

  for (var i = 0; i < arr.length; i++) {
    if (arr[i].delta >= 0) {
      deltaArr.push(arr[i].delta);
      msgArr.push(arr[i].delta + 'ms');
    } else {
      msgArr.push(arr[i].message);
    }
  }

  var minTime = Math.min.apply(null,deltaArr);

  for (var i = 0; i < arr.length; i++) {
    if (arr[i].delta === minTime) {
      var minTimeUrl = arr[i].url;
    }
  }

  postMessage({
    msgArr,
    minTime,
    minTimeUrl
  });
};