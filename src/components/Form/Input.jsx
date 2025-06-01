/* eslint-disable react/prop-types */

export const Input = ({ label, name, value, onChange, required = false, disabled }) => (
    <div>
        <label className="block text-sm font-medium mb-1">{label}</label>
        <input
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            maxLength={32}
            disabled={disabled}
            className={`w-full border rounded px-3 py-2 text-sm focus:ring focus:ring-blue-200 focus:outline-none ${disabled ? 'cursor-not-allowed bg-gray-100' : ''}`}
        />
    </div>
);

export const AlphaNumericInput = ({ label, name, value = '', onChange, required = false, disabled }) =>
{
    const handleChange = (e) =>
    {
        const newValue = e.target.value;
        const filteredValue = newValue.replace(/[^a-zA-Z0-9]/g, '');

        onChange?.({
            target: {
                name,
                value: filteredValue
            }
        });
    };

    return (
        <div>
            <label className="block text-sm font-medium mb-1">{label}</label>
            <input
                type="text"
                name={name}
                value={value || ''}
                onChange={handleChange}
                required={required}
                pattern="[a-zA-Z0-9]*"
                title="仅支持英文字母和数字"
                maxLength={32}
                disabled={disabled}
                className={`w-full border rounded px-3 py-2 text-sm focus:ring focus:ring-blue-200 focus:outline-none ${disabled ? 'cursor-not-allowed bg-gray-100' : ''}`}
            />
        </div>
    );
};


