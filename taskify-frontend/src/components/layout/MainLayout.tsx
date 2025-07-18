import { AppShell } from "@mantine/core";
import style from "./MainLayout.module.scss";
import NavBoard from "./Navboard";
import { Outlet } from "react-router-dom";
import { useLocalStorage } from "@mantine/hooks";

function MainLayout() {
  const [isNavBoardOpen, setIsNavBoardOpen] = useLocalStorage({
    key: "isNavOpen",
    defaultValue: true,
  });
  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header className={style.header}>Taskify</AppShell.Header>
      <AppShell.Navbar
        className={isNavBoardOpen ? style.navbar : style.navbarClose}
        onClick={() => {
          !isNavBoardOpen && setIsNavBoardOpen(true);
        }}
      >
        <NavBoard
          isNavBoardOpen={isNavBoardOpen}
          setIsNavBoardOpen={setIsNavBoardOpen}
        />
      </AppShell.Navbar>
      <AppShell.Main className={isNavBoardOpen ? style.main : style.mainClose}>
        <Outlet context={{ isNavBoardOpen, setIsNavBoardOpen }} />
      </AppShell.Main>
    </AppShell>
  );
}

export default MainLayout;
