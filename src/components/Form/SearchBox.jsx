/* eslint-disable react/prop-types */
// SearchBox.jsx
import { useState } from "react";

const SearchBox = ({ onSearch = defaultSearchHandler }) =>
{
    const [keyword, setKeyword] = useState("");

    function handleSubmit(e)
    {
        e.preventDefault();
        onSearch(keyword.trim());
    }

    return (
        <form onSubmit={handleSubmit} className="flex gap-2">
            <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="工单尾号2233或线索值"
                className="border p-1 rounded w-[25vw] max-w-[400px]"
            />
            <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">
                搜索
            </button>
        </form>
    );
};

function defaultSearchHandler(keyword)
{
    console.log("搜索关键词：", keyword);
}

export default SearchBox;
