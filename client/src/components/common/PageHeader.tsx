import React, { type ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description: string;
  action?: ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  action,
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600 mt-1">{description}</p>
        </div>
        {action && <div>{action}</div>}
      </div>
    </div>
  );
};

export default PageHeader;
