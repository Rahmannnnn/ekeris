import { ChangeEvent, useEffect, useState } from "react";
import Layout from "../../components/Layout";
// import Modal from "../../components/Modal";
import "./index.scss";
import { FaPlus } from "react-icons/fa6";
import { AiOutlineEdit, AiOutlineUpload } from "react-icons/ai";
import { AiOutlineDelete } from "react-icons/ai";
import {
  Modal,
  Button,
  Popover,
  Table,
  TableProps,
  Tag,
  Select,
  DatePicker,
  DatePickerProps,
  TimePicker,
  TimePickerProps,
  Tabs,
} from "antd";
import type { SearchProps } from "antd/es/input/Search";
import { Input } from "antd";
import { Record } from "../../interfaces/Record";
const { Search, TextArea } = Input;

type MODAL_TYPE = "ADD" | "DELETE" | "EDIT";
import type { TabsProps, UploadFile } from "antd";

import type { UploadProps } from "antd";
import { Upload } from "antd";
import { getLocalStorage } from "../../utils/localStorage";
import { LS_AUTH_KEY } from "../../constants/Base";
import { useNavigate } from "react-router-dom";

const { Dragger } = Upload;

const INITIAL_RECORD: Record = {
  id: "",
  name: "",
  dob: 0, // timestamp
  address: "",
  healthcare_address: "", // Alamat Faskes
  health_insurance_number: 0, // BPJS
  medical_record_number: 0, // Nomor Rekam Medis
  status: false, // True (archieved) / False (Out)
  position: "",
};

const Home = () => {
  const [keyword, setKeyword] = useState("");
  const [loading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<MODAL_TYPE>("DELETE");
  const [selectedRecord, setSelectedRecord] = useState<Record>(INITIAL_RECORD);

  const [newRecord, setNewRecord] = useState<Record>(INITIAL_RECORD);

  const updateInput = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setKeyword(value);
  };

  const updateNewRecord = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setNewRecord({ ...newRecord, [name]: value });
  };

  // TODO: Connect Backend
  const getAllRecords = async () => {};

  const onSearch: SearchProps["onSearch"] = (value, _e, info) => {
    console.log(info?.source, value);
  };

  const openModal = (type: MODAL_TYPE, record: Record) => {
    if (type === "EDIT" || type === "DELETE") {
      setSelectedRecord(record);
    }

    setModalType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    if (modalType === "ADD") {
      setNewRecord(INITIAL_RECORD);
    }

    if (modalType === "DELETE" || modalType === "EDIT") {
      setSelectedRecord(INITIAL_RECORD);
    }

    setModalType("DELETE");
    setShowModal(false);
  };

  const columns: TableProps<Record>["columns"] = [
    {
      title: "Nama",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Nomor Rekam Medis",
      dataIndex: "medical_record_number",
      key: "medical_record_number",
    },
    {
      title: "Nomor BPJS",
      dataIndex: "health_insurance_number",
      key: "health_insurance_number",
    },
    {
      title: "Alamat",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Alamat Faskes",
      dataIndex: "healthcare_address",
      key: "healthcare_address",
    },
    {
      title: "Letak Lemari",
      dataIndex: "position",
      key: "position",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, { status }) => {
        const color = status ? "green" : "yellow";
        return <Tag color={color}>{status ? "TERARSIP" : "DIPINJAM"}</Tag>;
      },
    },
    {
      title: "Aksi",
      key: "action",
      fixed: "right",
      render: (_, record: Record) => (
        <div
          style={{
            display: "flex",
            gap: "1rem",
          }}
        >
          <Popover content="Ubah Status">
            <Button
              onClick={() => openModal("EDIT", record)}
              icon={<AiOutlineEdit size="1.4rem" />}
            ></Button>
          </Popover>
          <Popover content="Hapus">
            <Button
              onClick={() => openModal("DELETE", record)}
              icon={<AiOutlineDelete size="1.4rem" />}
            ></Button>
          </Popover>
        </div>
      ),
    },
  ];

  const data: Record[] = [
    {
      id: "",
      name: "Arif Rahman Amrul Ghani",
      dob: 1715165290, // timestamp
      address: "",
      healthcare_address: "", // Alamat Faskes
      health_insurance_number: 0, // BPJS
      medical_record_number: 0, // Nomor Rekam Medis
      status: false, // True (archieved) / False (Out)
      position: "",
    },
    {
      id: "",
      name: "Arif Rahman Amrul Ghani",
      dob: 1715165290, // timestamp
      address: "",
      healthcare_address: "", // Alamat Faskes
      health_insurance_number: 0, // BPJS
      medical_record_number: 0, // Nomor Rekam Medis
      status: true, // True (archieved) / False (Out)
      position: "",
    },
  ];

  const handleSelectChange = (value: boolean) => {
    console.log("selected" + value);
    setSelectedRecord({ ...selectedRecord, status: value });
  };

  const updateDate: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);
  };

  const updateTime: TimePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);
  };

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const onChangeUpload: UploadProps["onChange"] = ({
    fileList: newFileList,
  }) => {
    setFileList(newFileList);
    console.log(fileList);
  };

  const props: UploadProps = {
    // name: "file",
    multiple: false,
    fileList,
    accept: ".xlsx,.csv",
    customRequest({ onSuccess }) {
      if (onSuccess) {
        setTimeout(() => {
          onSuccess("ok");
        }, 0);
      }
    },
    onChange: onChangeUpload,
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const addTabItems: TabsProps["items"] = [
    {
      key: "1",
      label: "Input Manual",
      children: (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <div className="modal__add__row">
            <div className="title">Nama</div>
            <div className="desc">
              <Input
                name="name"
                autoComplete="off"
                value={newRecord.name}
                onChange={updateNewRecord}
              />
            </div>
          </div>
          <div className="modal__add__row">
            <div className="title">Nomor Rekam Medis</div>
            <div className="desc">
              <Input
                name="medical_record_number"
                autoComplete="off"
                type="number"
                value={newRecord.medical_record_number}
                onChange={updateNewRecord}
              />
            </div>
          </div>
          <div className="modal__add__row">
            <div className="title">Nomor BPJS</div>
            <div className="desc">
              <Input
                name="health_insurance_number"
                autoComplete="off"
                type="number"
                value={newRecord.health_insurance_number}
                onChange={updateNewRecord}
              />
            </div>
          </div>

          <div className="modal__add__row">
            <div className="title">Alamat</div>
            <div className="desc">
              <TextArea
                name="address"
                autoComplete="off"
                allowClear
                value={newRecord.address}
                onChange={updateNewRecord}
              />
            </div>
          </div>

          <div className="modal__add__row">
            <div className="title">Alamat Faskes</div>
            <div className="desc">
              <TextArea
                name="healthcare_address"
                autoComplete="off"
                allowClear
                value={newRecord.healthcare_address}
                onChange={updateNewRecord}
              />
            </div>
          </div>

          <div className="modal__add__row">
            <div className="title">Letak Lemari</div>
            <div className="desc">
              <Input
                name="position"
                autoComplete="off"
                value={newRecord.position}
                onChange={updateNewRecord}
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "2",
      label: "Upload File",
      children: (
        <Dragger {...props}>
          <div
            className="drag"
            style={{
              padding: "4rem",
            }}
          >
            <AiOutlineUpload size={"4rem"} />
            <p className="ant-upload-text">
              Klik atau seret file ke area ini untuk diunggah
            </p>
          </div>
        </Dragger>
      ),
    },
  ];

  const navigate = useNavigate();
  useEffect(() => {
    const data = getLocalStorage(LS_AUTH_KEY);

    const { username } = data;
    if (!username) {
      navigate("/login");
      return;
    }

    getAllRecords();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout>
      <div className="home">
        <div className="home__searchbar">
          <Search
            placeholder="Masukkan nomor BPJS"
            onSearch={onSearch}
            onChange={updateInput}
            type="number"
            value={keyword}
            enterButton
            size="large"
          />
        </div>

        <div className="home__add">
          <Button
            onClick={() => openModal("ADD", INITIAL_RECORD)}
            icon={<FaPlus />}
            type="primary"
          >
            TAMBAH PASIEN BARU
          </Button>
        </div>

        <Table
          loading={loading}
          scroll={{ x: 800 }}
          columns={columns}
          dataSource={data}
        />
      </div>

      {modalType == "EDIT" && (
        <Modal
          title="UBAH STATUS"
          onCancel={closeModal}
          open={showModal}
          footer={[
            <Button key="cancel" onClick={() => setShowModal(false)}>
              BATAL
            </Button>,
            <Button
              key="save"
              type="primary"
              onClick={() => console.log("save")}
            >
              SIMPAN
            </Button>,
          ]}
        >
          <div className="modal__edit">
            <div className="modal__edit__row">
              <div className="title">Nama</div>
              <div className="desc">Arif Rahman</div>
            </div>

            <div className="modal__edit__row">
              <div className="title">Nomor Rekam Medis</div>
              <div className="desc">0000</div>
            </div>

            <div className="modal__edit__row">
              <div className="title">Nomor BPJS</div>
              <div className="desc">000000</div>
            </div>

            <div className="modal__edit__row">
              <div className="title">Status</div>
              <div className="desc">
                <Select
                  onChange={handleSelectChange}
                  defaultValue={selectedRecord.status}
                  style={{
                    width: "100%",
                  }}
                  options={[
                    { value: true, label: "TERARSIP" },
                    { value: false, label: "DIPINJAM" },
                  ]}
                />
              </div>
            </div>

            <div className="modal__edit__row">
              <div className="title">
                Waktu {!selectedRecord.status ? "Peminjaman" : "Pengembalian"}
              </div>

              <div className="desc datepicker">
                <div className="item">
                  <DatePicker
                    style={{
                      width: "100%",
                    }}
                    placeholder="Pilih Tanggal"
                    onChange={updateDate}
                  />
                </div>

                <div className="item">
                  <TimePicker
                    style={{
                      width: "100%",
                    }}
                    placeholder="Pilih Waktu"
                    onChange={updateTime}
                  />
                </div>
              </div>
            </div>

            {!selectedRecord.status && (
              <div className="modal__edit__row">
                <div className="title">Peminjam</div>
                <div className="desc">
                  <Input />
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {modalType === "DELETE" && (
        <Modal
          title="HAPUS"
          onCancel={closeModal}
          open={showModal}
          footer={[
            <Button key="cancel" onClick={() => setShowModal(false)}>
              BATAL
            </Button>,
            <Button
              key="delete"
              type="primary"
              onClick={() => console.log("save")}
            >
              HAPUS
            </Button>,
          ]}
        >
          <div className="modal__delete">
            <p>Apakah anda yakin ingin menghapus "{selectedRecord.name}" ?</p>
          </div>
        </Modal>
      )}

      {modalType === "ADD" && (
        <Modal
          title="TAMBAH PASIEN BARU"
          onCancel={() => setShowModal(false)}
          open={showModal}
          footer={[
            <Button key="cancel" onClick={() => setShowModal(false)}>
              BATAL
            </Button>,
            <Button
              key="delete"
              type="primary"
              onClick={() => console.log("save")}
            >
              TAMBAH
            </Button>,
          ]}
        >
          <div className="modal__add">
            <Tabs defaultActiveKey="1" items={addTabItems} />
          </div>
        </Modal>
      )}
    </Layout>
  );
};

export default Home;
