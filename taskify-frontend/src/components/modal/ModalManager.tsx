import { BaseTaskRes } from "@/types/column";
import { Button } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useState } from "react";

type Props = {
  task: BaseTaskRes;
};

function ModalsManager({ task }: Props) {
  const [test, setTest] = useState("!");
  return (
    <Button
      onClick={() =>
        modals.openContextModal({
          title: <Button onClick={() => setTest("可以")}>{test}</Button>,
          modal: "demonstration",
          innerProps: {
            modalBody: <Button>kk</Button>,
          },
        })
      }
    >
      {task.name}
    </Button>
  );
}

export default ModalsManager;
