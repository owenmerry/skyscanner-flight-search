import { useEffect, useRef, useState } from "react";
import { Modal } from "flowbite-react";
import { waitSeconds } from "~/helpers/utils";

export const Search = () => {
  const [showSearchModal, setShowSearchModal] = useState(false);
  return (
    <div>
      <div onClick={() => setShowSearchModal(!showSearchModal)}>
        <label
          htmlFor="default-search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400 cursor-pointer"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            className="cursor-pointer block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search Locations"
            disabled
          />
        </div>
      </div>
      <SearchModal
        show={showSearchModal}
        onClose={() => setShowSearchModal(false)}
      />
    </div>
  );
};

interface SearchModalProps {
  show?: boolean;
  onClose?: () => void;
}

export default function SearchModal({
  show = false,
  onClose,
}: SearchModalProps) {
  const [showModal, setShowModal] = useState<boolean>(show);
  const inputReference = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setShowModal(show);
    if (show) {
      focusInput();
    }
  }, [show]);

  const handleClose = async () => {
    await setShowModal(false);
    onClose && onClose();
  };
  const focusInput = async () => {
    await waitSeconds(0.1);
    inputReference?.current?.focus();
    console.log("show with focus");
  };

  return (
    <>
      <Modal dismissible show={showModal} onClose={handleClose}>
        <Modal.Body>
          <div className="space-y-6">
            <input
              ref={inputReference}
              type="text"
              autoFocus
              placeholder="Search"
            />
            <div>
              <SearchList />
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export function SearchList({}) {
  return <></>;
}
