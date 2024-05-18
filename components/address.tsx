import Input from "./input";

declare global {
    interface Window {
      daum: any;
    }
  }
  
  interface IAddr {
    address: string;
    zonecode: string;
  }
  
  export default function Addr() {
    const onClickAddr = () => {
      new window.daum.Postcode({
        oncomplete: function (data: IAddr) {
          (document.getElementById("addr") as HTMLInputElement).value =
            data.address;
          (document.getElementById("zipNo") as HTMLInputElement).value =
            data.zonecode;
          document.getElementById("addrDetail")?.focus();
        },
      }).open();
    };
  
    return (
        <>
        <button onClick={onClickAddr}>주소검색</button>
          <Input
            id="addr"
            name="addr"
            type="text"
            readOnly
            onClick={onClickAddr}
          />
          <Input
            name="zipNo"
            id="zipNo"
            type="text"
            readOnly
          />
          <Input
            name="addrDetail"
            id="addrDetail"
            type="text"
          />
        </>
    );
  }