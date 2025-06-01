import { useState } from 'react';
import ModalSelect from './ModalSelect';

export const useModalSelect = () =>
{
    const [visible, setVisible] = useState(false);
    const [options, setOptions] = useState([]);
    const [resolveFn, setResolveFn] = useState(null);

    const open = (opts) =>
    {
        setOptions(opts);
        setVisible(true);
        return new Promise((resolve) =>
        {
            setResolveFn(() => resolve);
        });
    };

    const handleConfirm = (value) =>
    {
        setVisible(false);
        resolveFn(value);
    };

    const handleCancel = () =>
    {
        setVisible(false);
        resolveFn(null);
    };

    const modal = (
        <ModalSelect
            visible={visible}
            options={options}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
        />
    );

    return [open, modal];
};
