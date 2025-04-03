import { TriangleAlert } from "lucide-react";

const ValidateError = ({ error }) => {
  return (
    <div className="flex items-center w-full mt-2">
      <div className="flex items-center text-red-500">
        <TriangleAlert size={12} />
        <span className="ml-2 text-sm">{error}</span>
      </div>
    </div>
  );
};
export default ValidateError;
