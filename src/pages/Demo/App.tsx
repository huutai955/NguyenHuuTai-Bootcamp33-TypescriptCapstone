import React, { useState } from 'react'
import { Editor } from '@tinymce/tinymce-react'
import { Button, Modal } from 'antd';
import {  Select } from 'antd';
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import type { SelectProps, RadioChangeEvent } from 'antd';

type Props = {}



const options: SelectProps['options'] = [];
for (let i = 10; i < 36; i++) {
    options.push({
        value: i.toString(36) + i,
        label: i.toString(36) + i,
    });
}

const handleChange = (value: string | string[]) => {
    console.log(`Selected: ${value}`);
};
export default function App({ }: Props) {
    const arr: SelectProps['options'] = [{
        value: 'as',
        label: 2
    }]
    const text = <span>Title</span>;
    const [isModalOpen, setIsModalOpen] = useState(false);

    const content = (
        <div>
            <p>Content</p>
            <p>Content</p>
        </div>
    );
    const buttonWidth = 70;
    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };


    const [size, setSize] = useState<SizeType>('middle');

    const handleSizeChange = (e: RadioChangeEvent) => {
        setSize(e.target.value);
    };

    return (
        <>
            <Button type="primary" onClick={showModal}>
                Open Modal
            </Button>
            <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Modal>



            <Select
                mode="tags"
                size={size}
                placeholder="Please select"
                defaultValue={['a10', 'c12']}
                onChange={handleChange}
                style={{ width: '100%' }}
                options={arr}
            />
        </>
    )
}