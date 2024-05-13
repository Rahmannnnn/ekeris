import { ChangeEvent, useEffect, useState } from "react";
import Layout from "../../components/Layout";

import * as XLSX from "xlsx";
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
  Space,
  notification,
} from "antd";

import { Input } from "antd";
import { Record } from "../../interfaces/Record";

import dayjs from "dayjs";
import type { Dayjs } from "dayjs";

type MODAL_TYPE = "DETAIL" | "ADD" | "DELETE" | "EDIT";

import type { TabsProps, UploadFile, UploadProps } from "antd";
import { Upload } from "antd";
import { getLocalStorage } from "../../utils/localStorage";
import { LS_AUTH_KEY } from "../../constants/Base";
import { useNavigate } from "react-router-dom";
import { BiDetail } from "react-icons/bi";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { RecordsClient } from "../../services/clients/RecordsClient";
import { useDebounce } from "../../utils/debounce";
import { History, HistoryResponse } from "../../interfaces/History";
import { HistoriesClient } from "../../services/clients/HistoriesClient";
import { DAYS, MONTHS } from "../../utils/date";

const { Dragger } = Upload;

interface RecordResponse extends Record {
  _id: string;
}

const INITIAL_RECORD: RecordResponse = {
  createdAt: 0,
  updatedAt: 0,
  _id: "",
  medical_record_number: "", // Nomor Rekam Medis
  name: "", // Nama
  health_insurance_number: "", // BPJS
  rank: "", // Pangkat
  registration_number: "", // NRP/NIP
  unitary_part: "", // Bagian Kesatuan
  health_service_provider: "", // PPK 1
  position: "", // Letak Lemari
  status: false, // True (archieved) / False (Out)
  borrower: "", // Peminjam (if status false)
  histories: [],
};

type SEARCHBY =
  | "name"
  | "medical_record_number"
  | "health_insurance_number"
  | "registration_number";

const Home = () => {
  const [keyword, setKeyword] = useState("");

  const [searchby, setSearchby] = useState<SEARCHBY>("health_insurance_number");

  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<MODAL_TYPE>("DELETE");
  const [selectedRecord, setSelectedRecord] =
    useState<RecordResponse>(INITIAL_RECORD);

  const updateInput = async (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setKeyword(value);
  };

  const updateRecordInput = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setSelectedRecord({ ...selectedRecord, [name]: value.toString() });
  };

  const openModal = (type: MODAL_TYPE, record: RecordResponse) => {
    if (type === "DETAIL" || type === "EDIT" || type === "DELETE") {
      setSelectedRecord(record);
      setHistoryReconds(
        record.histories.map((item) => {
          return {
            ...item,
            key: item._id,
          };
        })
      );
    }

    setModalType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    if (modalType === "ADD") {
      setFileList([]);
    }

    changeSelectedTab("1");
    setSelectedRecord(INITIAL_RECORD);

    setModalType("DELETE");
    setShowModal(false);
  };

  const columns: TableProps<RecordResponse>["columns"] = [
    {
      title: "Nomor Rekam Medis",
      dataIndex: "medical_record_number",
      key: "medical_record_number",
    },
    {
      title: "Nama",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Nomor BPJS",
      dataIndex: "health_insurance_number",
      key: "health_insurance_number",
    },
    {
      title: "Pangkat",
      dataIndex: "rank",
      key: "rank",
    },
    {
      title: "NRP / NIP",
      dataIndex: "registration_number",
      key: "registration_number",
    },
    {
      title: "Bagian Kesatuan",
      dataIndex: "unitary_part",
      key: "unitary_part",
    },
    {
      title: "PPK 1",
      dataIndex: "health_service_provider",
      key: "health_service_provider",
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
      render: (_, { status, borrower }) => {
        const color = status ? "green" : "yellow";
        return (
          <div className="status">
            <Tag color={color}>{status ? "TERARSIP" : `DIPINJAM`}</Tag>
            <p>{!status && borrower}</p>
          </div>
        );
      },
    },
    {
      title: "Aksi",
      key: "action",
      render: (_, record: RecordResponse) => (
        <div className="action">
          <div className="action__item">
            <Popover content="Detail">
              <Button
                onClick={() => openModal("DETAIL", record)}
                icon={<BiDetail size="1.4rem" />}
              ></Button>
            </Popover>
          </div>
          <div className="action__item">
            <Popover content="Ubah">
              <Button
                onClick={() => openModal("EDIT", record)}
                icon={<AiOutlineEdit size="1.4rem" />}
              ></Button>
            </Popover>
          </div>

          <div className="action__item">
            <Popover content="Hapus">
              <Button
                onClick={() => openModal("DELETE", record)}
                icon={<AiOutlineDelete size="1.4rem" />}
              ></Button>
            </Popover>
          </div>
        </div>
      ),
    },
  ];

  const historyColumn: TableProps<HistoryResponse>["columns"] = [
    {
      title: "Peminjam",
      dataIndex: "borrower",
      key: "borrower",
    },
    {
      title: "Waktu Peminjaman",
      dataIndex: "exitTime",
      key: "exitTime",
      render: (_, history: HistoryResponse) => {
        return <p>{history.exitTime > 0 && renderDate(history.exitTime)}</p>;
      },
    },
    {
      title: "Waktu Pengembalian",
      dataIndex: "entryTime",
      key: "entryTime",
      render: (_, history: HistoryResponse) => {
        return <p>{history.entryTime > 0 && renderDate(history.entryTime)}</p>;
      },
    },
  ];

  interface TableHistoryRecord extends HistoryResponse {
    key: string;
  }

  const [historyRecords, setHistoryReconds] = useState<TableHistoryRecord[]>(
    []
  );

  interface TableRecord extends RecordResponse {
    key: string;
  }

  const [records, setRecords] = useState<TableRecord[]>([]);

  const handleSearchbyChange = (value: SEARCHBY) => {
    setSearchby(value);
  };

  const handleSelectChange = (value: boolean) => {
    setSelectedRecord({ ...selectedRecord, status: value });
  };

  const [dateValue, setDateValue] = useState<Dayjs>(dayjs());
  const [timeValue, setTimeValue] = useState<Dayjs>(dayjs());

  const updateDate: DatePickerProps["onChange"] = (date) => {
    setDateValue(date);
  };

  const updateTime: TimePickerProps["onChange"] = (date) => {
    setTimeValue(date);
  };

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const onChangeUpload: UploadProps["onChange"] = ({
    fileList: newFileList,
  }) => {
    setFileList(newFileList);
  };

  const submitAdd = async () => {
    if (selectedTab === "1") {
      const {
        medical_record_number,
        name,
        health_insurance_number,
        rank,
        registration_number,
        unitary_part,
        health_service_provider,
        position,
        borrower,
        createdAt,
        updatedAt,
        histories,
      } = selectedRecord;

      const body: Record = {
        medical_record_number,
        name,
        health_insurance_number,
        rank,
        registration_number,
        unitary_part,
        health_service_provider,
        position,
        status: true,
        borrower,
        createdAt,
        updatedAt,
        histories,
      };

      if (medical_record_number !== "") {
        const { error, errorMessage } = await RecordsClient.addNewRecord(body);

        if (error) {
          api.error({
            message: errorMessage,
            placement: "top",
            duration: 2,
          });
        } else {
          api.success({
            message: "Data berhasil ditambahkan.",
            placement: "top",
            duration: 2,
          });
        }
      }
    }

    if (selectedTab === "2") {
      if (fileList.length) {
        const file = fileList[0];
        const { originFileObj } = file;

        if (originFileObj) {
          const workbook = XLSX.read(await originFileObj.arrayBuffer());
          const worksheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[worksheetName];
          const data = XLSX.utils.sheet_to_json(worksheet);

          const arrRecords: Record[] = [];

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data.forEach((item: any) => {
            const result = {
              createdAt: item.createdAt || new Date().getTime(),
              updatedAt: item.updatedAt || new Date().getTime(),
              medical_record_number: item.medical_record_number || "",
              name: item.name || "",
              health_insurance_number: item.health_insurance_number || "",
              rank: item.rank || "",
              registration_number: item.registration_number || "",
              unitary_part: item.unitary_part || "",
              health_service_provider: item.health_service_provider || "",
              position: item.position || "",
              status: true,
              borrower: item.borrower || "",
              histories: [],
            };

            arrRecords.push(result);
          });

          console.log(arrRecords);
          // TODO: Upload Data to Database
          const { error, errorMessage } = await RecordsClient.addBulkNewRecord(
            arrRecords
          );

          if (error) {
            api.error({
              message: errorMessage,
              placement: "top",
              duration: 2,
            });
          } else {
            api.success({
              message: "Data berhasil ditambahkan.",
              placement: "top",
              duration: 2,
            });
          }
        }
      }
    }

    await getAllRecords();
    closeModal();
  };

  const submitDelete = async () => {
    const { error, errorMessage } = await RecordsClient.deleteRecordById(
      selectedRecord._id
    );

    if (error) {
      api.error({
        message: errorMessage,
        placement: "top",
        duration: 2,
      });
    } else {
      api.success({
        message: "Data berhasil dihapus.",
        placement: "top",
        duration: 2,
      });
    }

    await getAllRecords();
    closeModal();
  };

  const submitEdit = async () => {
    const {
      _id,
      medical_record_number,
      name,
      health_insurance_number,
      rank,
      registration_number,
      unitary_part,
      health_service_provider,
      position,
      borrower,
      status,
      createdAt,
      updatedAt,
      histories,
    } = selectedRecord;

    const body: Record = {
      medical_record_number,
      name,
      health_insurance_number,
      rank,
      registration_number,
      unitary_part,
      health_service_provider,
      position,
      status,
      borrower,
      createdAt,
      updatedAt,
      histories,
    };

    const { error, errorMessage } = await RecordsClient.updateRecordById(_id, {
      ...body,
    });

    const index = records.findIndex((item) => item._id === selectedRecord._id);
    if (index !== -1) {
      if (records[index].status !== selectedRecord.status) {
        const date = new Date(
          dateValue.year(),
          dateValue.month(),
          dateValue.date(),
          timeValue.hour(),
          timeValue.minute(),
          timeValue.second(),
          timeValue.millisecond()
        ).getTime();

        if (!selectedRecord.status || selectedRecord.histories.length === 0) {
          // Peminjaman
          const historyBody: History = {
            createdAt: new Date().getTime(),
            updatedAt: new Date().getTime(),
            exitTime: date,
            entryTime: 0,
            borrower: selectedRecord.borrower,
            recordId: selectedRecord._id,
          };

          await HistoriesClient.addNewHistory(historyBody);
        } else {
          // Pengembalian
          const newestHistory = records[index].histories[histories.length - 1];
          await HistoriesClient.updateHistory(newestHistory._id, {
            ...newestHistory,
            entryTime: date,
            borrower: selectedRecord.borrower,
          });
        }
      } else {
        if (records[index].borrower !== selectedRecord.borrower) {
          const newestHistory = records[index].histories[histories.length - 1];
          await HistoriesClient.updateHistory(newestHistory._id, {
            ...newestHistory,
            borrower: selectedRecord.borrower,
          });
        }
      }
    }

    if (error) {
      api.error({
        message: errorMessage,
        placement: "top",
        duration: 2,
      });
    } else {
      api.success({
        message: "Data berhasil diubah.",
        placement: "top",
        duration: 2,
      });
    }

    await getAllRecords();
    closeModal();
  };

  const renderEditStatus = () => {
    const index = records.findIndex((item) => item._id === selectedRecord._id);
    if (index !== -1) {
      const rec = records[index];
      if (rec.status !== selectedRecord.status) {
        return (
          <>
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
                    name="date"
                    value={dateValue}
                    placeholder="Pilih Tanggal"
                    onChange={updateDate}
                  />
                </div>

                <div className="item">
                  <TimePicker
                    style={{
                      width: "100%",
                    }}
                    name="time"
                    value={timeValue}
                    placeholder="Pilih Waktu"
                    onChange={updateTime}
                  />
                </div>
              </div>
            </div>
          </>
        );
      }

      return <></>;
    }

    return <></>;
  };

  const props: UploadProps = {
    multiple: false,
    name: "file",
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

  const [selectedTab, setSelectedTab] = useState("1");
  const changeSelectedTab = (value: string) => {
    setSelectedTab(value);
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
            <div className="title">Nomor Rekam Medis</div>
            <div className="desc">
              <Input
                name="medical_record_number"
                autoComplete="off"
                value={selectedRecord.medical_record_number}
                onChange={updateRecordInput}
              />
            </div>
          </div>
          <div className="modal__add__row">
            <div className="title">Nama</div>
            <div className="desc">
              <Input
                name="name"
                autoComplete="off"
                value={selectedRecord.name}
                onChange={updateRecordInput}
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
                value={selectedRecord.health_insurance_number}
                onChange={updateRecordInput}
              />
            </div>
          </div>

          <div className="modal__add__row">
            <div className="title">Pangkat</div>
            <div className="desc">
              <Input
                name="rank"
                autoComplete="off"
                value={selectedRecord.rank}
                onChange={updateRecordInput}
              />
            </div>
          </div>

          <div className="modal__add__row">
            <div className="title">NRP/NIP</div>
            <div className="desc">
              <Input
                name="registration_number"
                autoComplete="off"
                value={selectedRecord.registration_number}
                onChange={updateRecordInput}
              />
            </div>
          </div>

          <div className="modal__add__row">
            <div className="title">Bagian Kesatuan</div>
            <div className="desc">
              <Input
                name="unitary_part"
                autoComplete="off"
                value={selectedRecord.unitary_part}
                onChange={updateRecordInput}
              />
            </div>
          </div>

          <div className="modal__add__row">
            <div className="title">PPK 1</div>
            <div className="desc">
              <Input
                name="health_service_provider"
                autoComplete="off"
                value={selectedRecord.health_service_provider}
                onChange={updateRecordInput}
              />
            </div>
          </div>

          <div className="modal__add__row">
            <div className="title">Letak Lemari</div>
            <div className="desc">
              <Input
                name="position"
                autoComplete="off"
                value={selectedRecord.position}
                onChange={updateRecordInput}
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
        <div className="upload">
          <div className="upload__help">
            <IoIosHelpCircleOutline size={"2rem"} />
            <p>Cara Penggunaan</p>
          </div>
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
        </div>
      ),
    },
  ];

  const renderDate = (n: number) => {
    const d = new Date(n);

    const year = d.getFullYear();
    const month = d.getMonth();
    const date = d.getDate();
    const day = d.getDay();

    const hour = d.getHours();
    const minute = d.getMinutes();
    const second = d.getSeconds();

    return `${DAYS[day]}, ${date > 9 ? date : "0" + date} ${
      MONTHS[month]
    } ${year} ${hour > 9 ? hour : "0" + hour}:${
      minute > 9 ? minute : "0" + minute
    }:${second > 9 ? second : "0" + second}`;
  };

  const detailTabItems: TabsProps["items"] = [
    {
      key: "1",
      label: "DATA PASIEN",
      children: (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <div className="modal__add__row">
            <div className="title">Nomor Rekam Medis</div>
            <div className="desc">{selectedRecord.medical_record_number}</div>
          </div>
          <div className="modal__add__row">
            <div className="title">Nama</div>
            <div className="desc">{selectedRecord.name}</div>
          </div>
          <div className="modal__add__row">
            <div className="title">Nomor BPJS</div>
            <div className="desc">{selectedRecord.health_insurance_number}</div>
          </div>

          <div className="modal__add__row">
            <div className="title">Pangkat</div>
            <div className="desc">{selectedRecord.rank}</div>
          </div>

          <div className="modal__add__row">
            <div className="title">NRP/NIP</div>
            <div className="desc">{selectedRecord.registration_number}</div>
          </div>

          <div className="modal__add__row">
            <div className="title">Bagian Kesatuan</div>
            <div className="desc">{selectedRecord.unitary_part}</div>
          </div>

          <div className="modal__add__row">
            <div className="title">PPK 1</div>
            <div className="desc">{selectedRecord.health_service_provider}</div>
          </div>

          <div className="modal__add__row">
            <div className="title">Letak Lemari</div>
            <div className="desc">{selectedRecord.position}</div>
          </div>

          <div className="modal__add__row">
            <div className="title">Status</div>
            <div className="desc">
              <Tag color={selectedRecord.status ? "green" : "yellow"}>
                {selectedRecord.status ? "TERARSIP" : `DIPINJAM`}
              </Tag>
            </div>
          </div>

          {!selectedRecord.status && (
            <div className="modal__add__row">
              <div className="title">Peminjam</div>
              <div className="desc">{selectedRecord.borrower}</div>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "2",
      label: "HISTORI PEMINJAMAN",
      children: (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <Table
            bordered
            pagination={false}
            scroll={{ y: 300 }}
            columns={historyColumn}
            dataSource={historyRecords}
          />
        </div>
      ),
    },
  ];

  const editTabItems: TabsProps["items"] = [
    {
      key: "1",
      label: "Detail",
      children: (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <div className="modal__edit__row">
            <div className="title">Nomor Rekam Medis</div>
            <div className="desc">
              <Input
                name="medical_record_number"
                autoComplete="off"
                value={selectedRecord.medical_record_number}
                onChange={updateRecordInput}
              />
            </div>
          </div>
          <div className="modal__edit__row">
            <div className="title">Nama</div>
            <div className="desc">
              <Input
                name="name"
                autoComplete="off"
                value={selectedRecord.name}
                onChange={updateRecordInput}
              />
            </div>
          </div>
          <div className="modal__edit__row">
            <div className="title">Nomor BPJS</div>
            <div className="desc">
              <Input
                name="health_insurance_number"
                autoComplete="off"
                type="number"
                value={selectedRecord.health_insurance_number}
                onChange={updateRecordInput}
              />
            </div>
          </div>

          <div className="modal__edit__row">
            <div className="title">Pangkat</div>
            <div className="desc">
              <Input
                name="rank"
                autoComplete="off"
                value={selectedRecord.rank}
                onChange={updateRecordInput}
              />
            </div>
          </div>

          <div className="modal__edit__row">
            <div className="title">NRP/NIP</div>
            <div className="desc">
              <Input
                name="registration_number"
                autoComplete="off"
                value={selectedRecord.registration_number}
                onChange={updateRecordInput}
              />
            </div>
          </div>

          <div className="modal__edit__row">
            <div className="title">Bagian Kesatuan</div>
            <div className="desc">
              <Input
                name="unitary_part"
                autoComplete="off"
                value={selectedRecord.unitary_part}
                onChange={updateRecordInput}
              />
            </div>
          </div>

          <div className="modal__edit__row">
            <div className="title">PPK 1</div>
            <div className="desc">
              <Input
                name="health_service_provider"
                autoComplete="off"
                value={selectedRecord.health_service_provider}
                onChange={updateRecordInput}
              />
            </div>
          </div>

          <div className="modal__edit__row">
            <div className="title">Letak Lemari</div>
            <div className="desc">
              <Input
                name="position"
                autoComplete="off"
                value={selectedRecord.position}
                onChange={updateRecordInput}
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "2",
      label: "Status",
      children: (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <div className="modal__edit__row">
            <div className="title">Nomor Rekam Medis</div>
            <div className="desc">{selectedRecord.medical_record_number}</div>
          </div>

          <div className="modal__edit__row">
            <div className="title">Nama</div>
            <div className="desc">{selectedRecord.name}</div>
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
          {renderEditStatus()}

          {!selectedRecord.status && (
            <div className="modal__edit__row">
              <div className="title">Peminjam</div>
              <div className="desc">
                <Input
                  name="borrower"
                  autoComplete="off"
                  onChange={updateRecordInput}
                  value={selectedRecord.borrower}
                />
              </div>
            </div>
          )}
        </div>
      ),
    },
  ];

  const [page, setPage] = useState(1);
  const size = 10;

  const navigate = useNavigate();
  useEffect(() => {
    const data = getLocalStorage(LS_AUTH_KEY);

    const { username } = data;
    if (!username) {
      navigate("/login");
      return;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const debounce = useDebounce(keyword, 500);

  useEffect(() => {
    getAllRecords();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchby, debounce]);

  const onSearch = async () => {
    await getAllRecords();
  };

  const getAllRecords = async () => {
    let params = {};
    if (page && size) {
      params = { ...params, page, size };
    }

    if (keyword) {
      params = { ...params, keyword, searchby };
    }

    setLoading(true);
    const { error, errorMessage, response } = await RecordsClient.getAllRecords(
      params
    );
    setLoading(false);

    if (!error) {
      if (response.length > 0) {
        setRecords(
          response.map((item: RecordResponse) => {
            return {
              ...item,
              key: item._id,
            };
          })
        );
      } else {
        setRecords([]);
      }
    }

    console.log(error, errorMessage, response);
  };

  const [api, contextHolder] = notification.useNotification();

  return (
    <Layout>
      {contextHolder}
      <div className="home">
        <div className="home__select">
          <div className="home__select__left">
            <p>Cari Berdasarkan</p>
            <Select
              style={{
                width: "100%",
              }}
              onChange={handleSearchbyChange}
              defaultValue="health_insurance_number"
              value={searchby}
              options={[
                { value: "medical_record_number", label: "Nomor Rekam Medis" },
                { value: "name", label: "Nama" },
                { value: "health_insurance_number", label: "Nomor BPJS" },
                { value: "registration_number", label: "NRP/NIP" },
              ]}
            />
          </div>
          <div className="home__select__right"></div>
        </div>
        <div className="home__searchbar">
          <Space.Compact style={{ width: "100%" }}>
            <Input allowClear onChange={updateInput} value={keyword} />
            <Button
              style={{ height: "100%" }}
              type="primary"
              onClick={onSearch}
            >
              Cari
            </Button>
          </Space.Compact>
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
          bordered
          sticky={true}
          pagination={{
            pageSize: 10,
            current: page,
            total: records.length,
            showSizeChanger: false,
            onChange(page) {
              setPage(page);
            },
          }}
          loading={loading}
          scroll={{ x: 1500, y: "auto" }}
          columns={columns}
          dataSource={records}
        />
      </div>
      {modalType === "EDIT" && (
        <Modal
          title="UBAH DATA"
          onCancel={closeModal}
          open={showModal}
          footer={[
            <Button key="cancel" onClick={closeModal}>
              BATAL
            </Button>,
            <Button key="save" type="primary" onClick={submitEdit}>
              SIMPAN
            </Button>,
          ]}
        >
          <div className="modal__edit">
            <Tabs
              activeKey={selectedTab}
              defaultActiveKey="1"
              items={editTabItems}
              onChange={changeSelectedTab}
            />
          </div>
        </Modal>
      )}
      {modalType === "DELETE" && (
        <Modal
          title="HAPUS"
          onCancel={closeModal}
          open={showModal}
          footer={[
            <Button key="cancel" onClick={closeModal}>
              BATAL
            </Button>,
            <Button key="delete" type="primary" onClick={submitDelete}>
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
          onCancel={closeModal}
          open={showModal}
          footer={[
            <Button key="cancel" onClick={closeModal}>
              BATAL
            </Button>,
            <Button
              key="add"
              disabled={selectedRecord.medical_record_number === ""}
              type="primary"
              onClick={submitAdd}
            >
              TAMBAH
            </Button>,
          ]}
        >
          <div className="modal__add">
            <Tabs
              activeKey={selectedTab}
              defaultActiveKey="1"
              items={addTabItems}
              onChange={changeSelectedTab}
            />
          </div>
        </Modal>
      )}
      {modalType === "DETAIL" && (
        <Modal
          title="DETAIL"
          onCancel={closeModal}
          open={showModal}
          footer={[
            <Button key="save" type="primary" onClick={closeModal}>
              TUTUP
            </Button>,
          ]}
        >
          <div className="modal__detail">
            <Tabs
              activeKey={selectedTab}
              defaultActiveKey="1"
              items={detailTabItems}
              onChange={changeSelectedTab}
            />
          </div>
        </Modal>
      )}
    </Layout>
  );
};

export default Home;
