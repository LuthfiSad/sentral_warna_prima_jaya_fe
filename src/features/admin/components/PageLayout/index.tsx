import { convertQueryParamsToObject } from "@features/_global/helper";
import {
  ButtonHTMLAttributes,
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Pagination } from "../../../_global/components/Pagination";

interface IPageLayoutProps extends PropsWithChildren {
  children?: React.ReactNode;
  title?: string;
  showPagination?: boolean;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
  action?: {
    buttonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className">;
    buttonTitle?: string;
    show?: boolean;
    link?: {
      to?: string;
    };
    colorButton?: string;
  };
  headBackground?: string;
  searchField?: boolean;
  searchPlaceholder?: string;
  buttonFilter?: string;
  buttonFilterOptions?: {
    label: string;
    key: string;
    value: string;
  }[];
  buttonCheckbox?: {
    label: string;
    key: string;
    value: string;
  };
}

export const PageLayout: React.FC<IPageLayoutProps> = ({
  children,
  pagination = { currentPage: 1, totalPages: 1, onPageChange: () => {} },
  showPagination,
  title,
  action,
  headBackground = "gray",
  searchField = false,
  searchPlaceholder = "search kambing..",
  buttonFilter,
  buttonFilterOptions = [],
  buttonCheckbox,
}) => {
  const renderAction = () => {
    if (action?.show && action.link) {
      return (
        <Link to={action.link.to as string}>
          <button
            type="button"
            className="btn btn-sm btn-primary"
            style={{ backgroundColor: action.colorButton }}
            {...action?.buttonProps}
          >
            {action?.buttonTitle}
          </button>
        </Link>
      );
    }

    if (action?.show) {
      return (
        <button
          type="button"
          className={`btn btn-sm btn-primary`}
          style={{ backgroundColor: action.colorButton }}
          {...action?.buttonProps}
        >
          {action?.buttonTitle}
        </button>
      );
    }

    return null;
  };

  const [searchParams, setSearchParams] = useSearchParams();
  const queryParams = convertQueryParamsToObject(searchParams.toString());

  const handeSearchChange = useCallback(
    (key: string, value: string) => {
      setSearchParams({
        ...queryParams,
        [key]: queryParams[key] === value ? "" : value,
      });
    },
    [queryParams, setSearchParams]
  );

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Toggle dropdown
  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div>
      <div className="card">
        <div
          className="card-header d-flex justify-content-between align-items-center flex-wrap mb-4 p-3"
          style={{ backgroundColor: headBackground, color: "white" }}
        >
          <h6 className="card-title m-0">{title}</h6>
          <div>{renderAction()}</div>
        </div>

        <div className="flex flex-wrap justify-end gap-2 mx-4">
          {buttonFilter && buttonFilterOptions.length > 0 && (
            <div className="dropdown" ref={dropdownRef}>
              <button
                className={`btn btn-primary dropdown-toggle me-1 ${
                  isOpen ? "show" : ""
                }`}
                type="button"
                onClick={toggleDropdown}
                aria-expanded={isOpen}
              >
                {buttonFilter}
              </button>
              <div className={`dropdown-menu ${isOpen ? "show" : ""}`}>
                {buttonFilterOptions.map((option) => (
                  <span
                    className={`dropdown-item cursor-pointer hover:bg-blue-400 ${
                      queryParams[option.key] === option.value
                        ? "bg-blue-500"
                        : ""
                    }`}
                    onClick={() => handeSearchChange(option.key, option.value)}
                  >
                    {option.label}
                  </span>
                ))}
              </div>
            </div>
          )}
          {buttonCheckbox && (
            <button
              className={`btn ${
                queryParams[buttonCheckbox.key] === buttonCheckbox.value
                  ? "btn-blue"
                  : "btn-outline-blue"
              }`}
              type="button"
              onClick={() =>
                handeSearchChange(buttonCheckbox.key, buttonCheckbox.value)
              }
            >
              {buttonCheckbox.label}
            </button>
          )}
          {searchField && (
            <div className="w-lg-25 ms-auto mb-3">
              <input
                type="text"
                onChange={(e) => handeSearchChange("search", e.target.value)}
                placeholder={searchPlaceholder}
                className="form-control"
              />
            </div>
          )}
        </div>

        <div className="card-body overflow-auto px-4 py-2">{children}</div>
      </div>

      {showPagination && <Pagination {...pagination} />}
    </div>
  );
};
