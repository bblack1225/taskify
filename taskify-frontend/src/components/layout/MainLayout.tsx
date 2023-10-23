import { AppShell } from "@mantine/core"
import style from "./MainLayout.module.scss"

type Props = {
  children: React.ReactNode
}

function MainLayout({ children }: Props) {
  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <div style={{ padding: "15px" }}>Taskify</div>
      </AppShell.Header>
      <AppShell.Navbar p="md" w="250px">
        Navbar
      </AppShell.Navbar>
      <AppShell.Main className={style.main}>{children}</AppShell.Main>
    </AppShell>
  )
}

export default MainLayout
