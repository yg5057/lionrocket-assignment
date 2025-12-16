import { createContext, useContext, useState, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";

interface ModalOptions {
  title: string;
  message: string;
  type: "alert" | "confirm";
  onConfirm?: () => void;
}

interface ModalContextType {
  showAlert: (title: string, message: string) => void;
  showConfirm: (title: string, message: string, onConfirm: () => void) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<ModalOptions>({
    title: "",
    message: "",
    type: "alert",
  });

  const showAlert = (title: string, message: string) => {
    setConfig({ title, message, type: "alert" });
    setIsOpen(true);
  };

  const showConfirm = (
    title: string,
    message: string,
    onConfirm: () => void
  ) => {
    setConfig({ title, message, type: "confirm", onConfirm });
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleConfirm = () => {
    if (config.onConfirm) {
      config.onConfirm();
    }
    setIsOpen(false);
  };

  return (
    <ModalContext.Provider value={{ showAlert, showConfirm }}>
      {children}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{config.title}</DialogTitle>
            <DialogDescription className="pt-2 text-gray-700">
              {config.message}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 mt-4">
            {config.type === "confirm" && (
              <Button variant="outline" onClick={handleClose}>
                취소
              </Button>
            )}
            <Button
              onClick={config.type === "confirm" ? handleConfirm : handleClose}
            >
              확인
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ModalContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
