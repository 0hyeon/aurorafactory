"use client";
import { motion, useAnimation, useViewportScroll } from "framer-motion";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import styles from "./style.module.scss";
function Search() {
  const [searchOpen, setSearchOpen] = useState(false);
  const inputAnimation = useAnimation();
  const { register, handleSubmit, setValue } = useForm<any>();
  const router = useRouter();
  const toggleSearch = () => {
    if (searchOpen) {
      inputAnimation.start({
        scaleX: 0,
      });
    } else {
      inputAnimation.start({ scaleX: 1 });
    }
    setSearchOpen((prev) => !prev);
  };
  const onSubmit = (data: any) => {
    router.push(`/search?keyword=${data.keyword}`);
    setValue("keyword", "");
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <motion.svg
        onClick={toggleSearch}
        animate={{ x: searchOpen ? -200 : 0 }}
        transition={{ type: "linear" }}
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.searchSvg}
      >
        <path
          fillRule="evenodd"
          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
          clipRule="evenodd"
        ></path>
      </motion.svg>
      <motion.input
        placeholder="검색어를 입력해주세요."
        animate={inputAnimation}
        className={styles.inputSearch}
        initial={{ scaleX: 0 }}
        transition={{ type: "linear" }}
        {...register("keyword", { required: true, minLength: 2 })}
      />
    </form>
  );
}

export default Search;
