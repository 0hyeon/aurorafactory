import React from "react";
const Footer = () => {
  return (
    <>
      <div className="max-w-5xl mx-auto py-5 felx flex-col gap-5">
        <ul className="md:text-base text-sm cursor-pointer flex p-0 m-0 mb-6 items-center justify-center">
          <li className="list-none border-none pl-0 ml-0">회사소개</li>
          <li className="list-none border-l border-black md:ml-4 md:pl-4 ml-1 pl-1">
            개인정보처리방침
          </li>
          <li className="list-none border-l border-black md:ml-4 md:pl-4 ml-1 pl-1">
            이용약관
          </li>
          <li className="list-none border-l border-black md:ml-4 md:pl-4 ml-1 pl-1">
            선결제이용약관
          </li>
        </ul>
        <div className="flex md:block md:items-center items-center md:justify-center justify-center">
          <div>
            <ul className="md:p-0 px-2 text-sm md:text-base">
              <li>주식회사 오로라팩 대표 : 김길수</li>
              <li>주소 : 안성시 보개면 오두리 161</li>
              <li>
                제조업 : 제2013-0050453호 통신판매업 : 제2015-경기안성-03602호
              </li>
              <li>사업자등록번호 : 209-81-58898 [사업자정보확인]</li>
              <li>개인정보보호책임자 : 김영현</li>
              <li>
                [KOR] 이메일 : djdjdjk@hanmail.com 신규 거래 문의 :
                010-2603-1599
              </li>
              <li>[ENG, CHN] 이메일 : djdjdjk@hanmail.com</li>
              <li className="mt-6 font-bold">
                Copyright AuroraFactory co., Ltd. All right reserved.
              </li>
            </ul>
          </div>
          <div></div>
        </div>
      </div>
      <div className="flex">
        <div></div>
        <div></div>
      </div>
    </>
  );
};

export default Footer;
