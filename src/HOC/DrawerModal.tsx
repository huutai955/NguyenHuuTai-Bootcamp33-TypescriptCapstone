import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space } from 'antd';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DispatchType, RootState } from '../redux/configStore';
type Props = {}

const { Option } = Select;
export default function DrawerModal({ }: Props) {
    const dispatch: DispatchType = useDispatch();

    // console.log(Component);
    // const onClose = () => {
    //     const action = setOpen(false);
    //     dispatch(action);
    // };
    return (
        <div>
            <Drawer
                title="Create a new account"
                width={720}
                // onClose={onClose}
                // open={visible}
                bodyStyle={{ paddingBottom: 80 }}
            >
              {/* {Component} */}
            </Drawer>
        </div>
    )
}