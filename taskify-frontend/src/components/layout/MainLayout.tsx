import { AppShell } from "@mantine/core";
import style from "./MainLayout.module.scss";
import NavBoard from "./NavBoard";

type Props = {
  children: React.ReactNode;
};

function MainLayout({ children }: Props) {
  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header className={style.header}>Taskify</AppShell.Header>
      <AppShell.Navbar className={style.navbar}>
        <NavBoard />
      </AppShell.Navbar>
      <AppShell.Main className={style.main}>{children}</AppShell.Main>
    </AppShell>
  );
}

export default MainLayout;
