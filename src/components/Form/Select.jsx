/* eslint-disable react/prop-types */
export const Select = ({ label, name, options = [], value, onChange, required = false, disabled = false }) => (
    <div>
        <label className="block text-sm font-medium mb-1">{label}</label>
        <select
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            disabled={disabled}
            className={`w-full  border border-gray-300 rounded px-3 py-2 text-sm  focus:ring-blue-200 focus:outline-blue-400
                ${disabled ? 'cursor-not-allowed bg-gray-100' : 'cursor-pointer '}
                 `}
        >
            <option value="">请选择</option>
            {options.map((opt) => (
                <option key={opt} value={opt}>
                    {opt}
                </option>
            ))}
        </select>
    </div >
);

export const LabeledInputWithSelect = ({
    selectOptions = [],
    selectValue = '',
    inputValue = '',
    onSelectChange,
    onInputChange,
    placeholder = '请选择',
    disabled = false,
    required = false,
}) =>
{
    return (
        <div className="flex items-center space-x-2 border py-2 px-4 rounded">
            <select
                className="rounded bg-white text-sm border-r "
                value={selectValue}
                onChange={onSelectChange}
                disabled={disabled}
                required={required}
            >
                <option value="">请选择</option>
                {Array.isArray(selectOptions) && selectOptions.map((opt) =>
                {
                    const value = typeof opt === 'object' ? opt.value : opt;
                    const label = typeof opt === 'object' ? opt.label : opt;
                    return (
                        <option key={value} value={value}>
                            {label}
                        </option>
                    );
                })}
            </select>
            <input
                type="text"
                value={inputValue}
                onChange={onInputChange}
                disabled={disabled}
                placeholder={placeholder}
                required={required}
                maxLength={48}
                className=" rounded text-sm w-full focus:outline-none"
            />
        </div>
    );
};
