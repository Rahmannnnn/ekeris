import { ChangeEvent, useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Modal from "../../components/Modal";
import "./index.scss";
import { FaPlus } from "react-icons/fa6";
import { AiOutlineEdit } from "react-icons/ai";
import { AiOutlineDelete } from "react-icons/ai";
import { Button, Popover, Table, TableProps, Tag } from "antd";
import type { SearchProps } from "antd/es/input/Search";
import { Input } from "antd";
const { Search } = Input;

type MODAL_TYPE = "ADD" | "DELETE" | "EDIT" | "LOGOUT";

const Home = () => {
  const [keyword, setKeyword] = useState("");
  const [loading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<MODAL_TYPE>("DELETE");

  const updateInput = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setKeyword(value);
  };

  // TODO: Connect Backend
  const getAllRecords = async () => {};

  const onSearch: SearchProps["onSearch"] = (value, _e, info) => {
    console.log(info?.source, value);
  };

  interface DataType {
    key: string;
    name: string;
    dob: number; // timestamp
    address: string;
    healthcare_address: string; // Alamat Faskes
    health_insurance_number: number; // BPJS
    medical_record_number: number; // Nomor Rekam Medis
    status: boolean; // True (archieved) / False (Out)
    position: string;
  }

  const columns: TableProps<DataType>["columns"] = [
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
      render: () => (
        <div
          style={{
            display: "flex",
            gap: "1rem",
          }}
        >
          <Popover content="Ubah Status">
            <Button icon={<AiOutlineEdit size="1.4rem" />}></Button>
          </Popover>
          <Popover content="Hapus">
            <Button icon={<AiOutlineDelete size="1.4rem" />}></Button>
          </Popover>
        </div>
      ),
    },
  ];

  const data: DataType[] = [
    {
      key: "",
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
      key: "",
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

  useEffect(() => {
    getAllRecords();
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
          <Button icon={<FaPlus />} type="primary">
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

      <Modal isOpen={showModal} close={() => setShowModal(false)}>
        <div className="home__modal">cek</div>
      </Modal>
    </Layout>
  );
};

export default Home;
