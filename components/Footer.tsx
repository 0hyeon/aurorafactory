import React from "react";
const Footer = () => {
  return (
    <>
      <div className="max-w-5xl mx-auto py-5">
        <ul className="flex p-0 m-0">
          <li className="list-none border-none pl-0 ml-0">회사소개</li>
          <li className="list-none border-l border-black ml-4 pl-4">
            개인정보처리방침
          </li>
          <li className="list-none border-l border-black ml-4 pl-4">
            이용약관
          </li>
          <li className="list-none border-l border-black ml-4 pl-4">
            선결제이용약관
          </li>
          <li className="list-none border-l border-black ml-4 pl-4">
            또박케어 앱 소개
          </li>
        </ul>
      </div>
      <div className="flex">
        <div>
          <ul>
            <li>주식회사 헥토헬스케어 대표 : 이경민, 김석진</li>
            <li>
              주소 : 서울특별시 강남구 테헤란로 223, 10층 (역삼동, 큰길타워빌딩)
            </li>
            <li>
              건강기능식품 판매업 : 제2013-0050453호 통신판매업 :
              제2015-서울강남-03602호
            </li>
            <li>사업자등록번호 : 209-81-58898 [사업자정보확인]</li>
            <li>개인정보보호책임자 : 권성호</li>
            <li>
              [KOR] 이메일 : admin_hc@hecto.co.kr 신규 거래 문의 : 1811-0171
            </li>
            <li>[ENG, CHN] 이메일 : dmk@hecto.co.kr</li>
            <li>Copyright HECTO Healthcare co., Ltd. All right reserved.</li>
          </ul>
        </div>
        <div></div>
      </div>
      <div className="flex">
        <div></div>
        <div></div>
      </div>
    </>
  );
};

export default Footer;
