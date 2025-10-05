import SearchIcon from "@mui/icons-material/Search";

const SearchInput = ({ value, onChange }: any) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <SearchIcon sx={{ fontSize: 20, color: "#6b7280" }} />
    </div>
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder="Search candidates by name, email..."
      className="w-80 pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
    />
  </div>
);

export default SearchInput;
