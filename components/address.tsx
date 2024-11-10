import React, { useEffect, useState } from "react";
import Input from "@/components/input";
import Button from "./button";
import Script from "next/script";

export default function Addr({ addressData, setAddressData, state }: any) {
  const [isDaumLoaded, setIsDaumLoaded] = useState(false);

  const checkDaumLoaded = () => {
    if (window.daum && window.daum.Postcode) {
      setIsDaumLoaded(true);
    }
  };

  useEffect(() => {
    // Check if Daum Postcode API is available after script loads
    if (!isDaumLoaded) {
      checkDaumLoaded();
    }
  }, [isDaumLoaded]);

  const onClickAddr = () => {
    if (isDaumLoaded) {
      new window.daum.Postcode({
        oncomplete: function (data: any) {
          setAddressData({
            ...addressData,
            address: data.roadAddress,
            postaddress: data.zonecode,
          });
          document.getElementById("detailaddress")?.focus();
        },
      }).open();
    } else {
      console.error("Daum Postcode API is not available.");
    }
  };


  return (
    <>
       <Script
        src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
        strategy="afterInteractive"
        onLoad={() => setIsDaumLoaded(true)} // 스크립트가 로드된 후 isDaumLoaded를 true로 설정
      />
      <Button text="주소검색" onClick={onClickAddr} />
      <Input
        id="address"
        placeholder="도로명주소"
        name="address"
        type="text"
        value={addressData.address}
        onClick={onClickAddr}
        readOnly
        errors={state?.error?.fieldErrors?.address}
      />
      <Input
        name="postaddress"
        placeholder="우편주소"
        id="postaddress"
        type="text"
        value={addressData.postaddress}
        readOnly
        errors={state?.error?.fieldErrors?.postaddress}
      />
      <Input
        name="detailaddress"
        placeholder="상세주소"
        id="detailaddress"
        type="text"
        value={addressData.detailaddress}
        onChange={(e) =>
          setAddressData({ ...addressData, detailaddress: e.target.value })
        }
        errors={state?.error?.fieldErrors?.detailaddress}
      />
    </>
  );
}
