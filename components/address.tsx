import React from "react";
import Input from "@/components/input";

export default function Addr({ addressData, setAddressData, state }:any) {
  const onClickAddr = () => {
    new window.daum.Postcode({
      oncomplete: function (data:any) {
        setAddressData({
          ...addressData,
          address: data.roadAddress,
          postaddress: data.zonecode,
        });
        document.getElementById("detailaddress")?.focus();
      },
    }).open();
  };

  return (
    <>
      <button type="button" className="h-10 text-left" onClick={onClickAddr}>주소검색</button>
      <Input
        id="address"
        placeholder="도로명주소"
        name="address"
        type="text"
        value={addressData.address}
        onClick={onClickAddr}
        readOnly
        errors={state?.fieldErrors?.address}
      />
      <Input
        name="postaddress"
        placeholder="우편주소"
        id="postaddress"
        type="text"
        value={addressData.postaddress}
        readOnly
        errors={state?.fieldErrors?.postaddress}
      />
      <Input
        name="detailaddress"
        placeholder="상세주소"
        id="detailaddress"
        type="text"
        value={addressData.detailaddress}
        onChange={(e) => setAddressData({ ...addressData, detailaddress: e.target.value })}
        errors={state?.fieldErrors?.detailaddress}
      />
    </>
  );
}
