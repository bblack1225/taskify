import { AppShell } from "@mantine/core";
import style from "./MainLayout.module.scss";
import NavBoard from "./Navboard";
import { useState } from "react";

type Props = {
  children: React.ReactNode;
};

function MainLayout({ children }: Props) {
  const [isNavBoardOpen, setIsNavBoardOpen] = useState(true);
  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header className={style.header}>Taskify</AppShell.Header>
      <AppShell.Navbar
        className={isNavBoardOpen ? style.navbar : style.navbarClose}
      >
        <NavBoard
          isNavBoardOpen={isNavBoardOpen}
          setIsNavBoardOpen={setIsNavBoardOpen}
        />
      </AppShell.Navbar>
      <AppShell.Main className={isNavBoardOpen ? style.main : style.mainClose}>
        {children}
      </AppShell.Main>
    </AppShell>
  );
}

export default MainLayout;
