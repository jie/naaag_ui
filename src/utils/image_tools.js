function dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);
  
    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  
    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
  
    //Old Code
    //write the ArrayBuffer to a blob, and you're done
    //var bb = new BlobBuilder();
    //bb.append(ab);
    //return bb.getBlob(mimeString);
  
    //New Code
    return new Blob([ab], { type: mimeString });
  }
  
  function srcToFile(src, fileName, mimeType) {
    return (fetch(src)
      .then(function (res) { return res.arrayBuffer(); })
      .then(function (buf) { return new File([buf], fileName, { type: mimeType }); })
    );
  }
  
  function dataURLtoFile(dataUrl, fileName) {
    var arr = dataUrl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], fileName, { type: mime });
  }
  
  function fileOrBlobToDataURL(obj) {
    return new Promise((resolve) => {
      var a = new FileReader();
      a.readAsDataURL(obj);
      a.onload = function (e) {
        // cb(e.target.result);
        const img = new Image();
        img.src = e.target.result;
        img.onload = function () {
          resolve(img);
        };
      };
    });
  }
  
  function rgb2hex(rgb) {
    var reg = /(\d{1,3}),(\d{1,3}),(\d{1,3})/;
    var arr = reg.exec(rgb);
  
    function hex(x) {
      return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    var _hex = "#" + hex(arr[1]) + hex(arr[2]) + hex(arr[3]);
    return _hex.toUpperCase();
  }
  
  function isPureColorImage(ctx, sx, sy, sw, sh) {
    let imageData = ctx.getImageData(sx, sy, sw, sh);
    console.log('imageData:', imageData)
  }
  
  export {
    srcToFile,
    dataURItoBlob,
    fileOrBlobToDataURL,
    dataURLtoFile,
    rgb2hex,
    isPureColorImage
  }