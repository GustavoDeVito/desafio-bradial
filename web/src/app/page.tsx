"use client";

import { Button } from "@nextui-org/react";
import { toast } from "sonner";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Button
        variant="solid"
        color="primary"
        onPress={() => toast.info("Event has been created.")}
      >
        Notification
      </Button>
    </main>
  );
}
