import React, { useState, useEffect, useContext } from "react";
import { HotKeys } from "react-hotkeys";
import { Select, Form, Input, Radio, Space } from "antd";
import "antd/lib/input/style/index.css";

import { GlobalContext } from "../../Context/GlobalState";

const Create = () => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [issue, setIssue] = useState("");
  const [priority, setPriority] = useState("Normal");
  const [options, setOptions] = useState([]);
  const [form] = Form.useForm();

  const { createTicket } = useContext(GlobalContext);

  const { Option } = Select;

  const handlers = {
    CLOSE: () => setShow(false),
  };

  const fetchClients = async () => {
    await fetch(`/api/v1/client/allclients`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res) {
          setOptions(res.client);
        }
      });
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const search = options ? (
    options.map((d) => <Option key={d._id}>{d.name}</Option>)
  ) : (
    <Option key="no_id">
      <p>Please refresh</p>
    </Option>
  );

  return (
    <div>
      <HotKeys handlers={handlers}>
        <div>
          <button
            onClick={() => setShow(true)}
            type="button"
            className="flex-shrink-0 p-1 text-cyan-200 rounded-full hover:text-white hover:bg-white hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-white"
          >
            <span className="sr-only">View notifications</span>
            <span className="text-white">Create Ticket</span>
          </button>
        </div>

        <div
          className={`${
            show
              ? 'fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title'
              : "hidden"
          }`}
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
            ></div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <h1 className="text-xl text-center m-2 p-2 font-bold">
                  New Ticket
                </h1>
                <Form>
                  <Form
                    size="middle"
                    form={form}
                    layout="vertical"
                    name="form_in_modal"
                    initialValues={{
                      modifier: "public",
                    }}
                  >
                    <Form.Item name="name">
                      <input
                        type="text"
                        id="name"
                        placeholder="Enter name here..."
                        name="name"
                        onChange={(e) => setName(e.target.value)}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </Form.Item>
                    <Form.Item name="email">
                      <input
                        type="text"
                        name="email"
                        placeholder="Enter email here...."
                        onChange={(e) => setEmail(e.target.value)}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"

                      />
                    </Form.Item>
                    <Form.Item name="Client">
                      <Select
                        showSearch
                        placeholder="Select a client"
                        optionFilterProp="children"
                        onChange={setCompany}
                        filterOption={(input, option) =>
                          option.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {search}
                      </Select>
                    </Form.Item>
                    <Form.Item name="issue" label="Issue">
                      <Input.TextArea
                        rows={5}
                        onChange={(e) => setIssue(e.target.value)}
                      />
                    </Form.Item>
                    <Form.Item
                      name="modifier"
                      label="Priority"
                      className="flex justify-items-center items-center"
                    >
                      <Radio.Group
                        buttonStyle="solid"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="mx-auto"
                      >
                        <Space>
                          <Radio.Button value="Low">Low</Radio.Button>
                          <Radio.Button value="Normal">Normal</Radio.Button>
                          <Radio.Button value="High" className="bg-red">
                            High
                          </Radio.Button>
                        </Space>
                      </Radio.Group>
                    </Form.Item>
                  </Form>
                </Form>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  onClick={async () => {
                    await createTicket(name, email, company, issue, priority);
                    setShow(false);
                  }}
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                >
                  Create
                </button>
                <button
                  onClick={() => {
                    setShow(false);
                  }}
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </HotKeys>
    </div>
  );
};

export default Create;