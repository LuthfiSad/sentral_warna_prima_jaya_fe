import { convertQueryParamsToObject } from "@features/_global/helper";
import { ButtonHTMLAttributes, PropsWithChildren, useCallback } from "react";
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

  const handeSearchChange: React.ChangeEventHandler<HTMLInputElement> =
    useCallback(
      (e) => {
        setSearchParams({ ...queryParams, search: e.target.value });
      },
      [queryParams, setSearchParams]
    );

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

        {searchField && (
          <div className="w-lg-25 ms-auto me-4 mb-3">
            <input
              type="text"
              onChange={handeSearchChange}
              placeholder={searchPlaceholder}
              className="form-control"
            />
          </div>
        )}

        <div className="card-body overflow-auto px-4 py-2">{children}</div>
      </div>

      {showPagination && <Pagination {...pagination} />}
    </div>
  );
};
