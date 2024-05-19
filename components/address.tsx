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
  
  export default function Addr({register,errors,setValue}:{register:any,errors:any,setValue:any}) {
    const onClickAddr = () => {
      new window.daum.Postcode({
        oncomplete: function (data: IAddr) {
          setValue("address", data.address);
          setValue("postaddress", data.zonecode);
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
            {...register("address")}
            type="text"
            onClick={onClickAddr}
            errors={[errors?.address?.message ?? ""]}
          />
          <Input
            {...register("postaddress")}
            placeholder="우편주소"
            id="postaddress"
            type="text"
            readOnly
            errors={[errors?.postaddress?.message ?? ""]}
            />
          <Input
            {...register("detailaddress")}
            placeholder="상세주소"
            id="detailaddress"
            type="text"
            errors={[errors?.detailaddress?.message ?? ""]}
          />
        </>
    );
  }