import React from "react";
import Input from "@/components/input";
import Button from "./button";

export default function Addr({ addressData, setAddressData, state }: any) {
  const onClickAddr = () => {
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
  };

  return (
    <>
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
