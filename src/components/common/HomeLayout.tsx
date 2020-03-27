import React from "react";

import { Header } from "./Header";

type HomeLayoutProps = {
  children?: React.ReactNode,
  title: string
};

export const HomeLayout: React.FC<HomeLayoutProps> = ({ children, title }) => {
  return (
    <div>
      <Header title={ title }></Header>
      <main>
        { children }
      </main>

      <style jsx>{`
        .wrap {
          width: 100%;
        }

        main {
          width: 100%;
          margin-top: 80px;
          height: calc(100vh - 80px);
          background-color: #E3EAF5;
          overflow-y: scroll;
        }
      `}</style>
    </div>
  );
}
