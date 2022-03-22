import axios from "axios";
import React, { useState } from "react";
import { CSVLink } from "react-csv";
import * as XLSX from "xlsx";

const Home = () => {
  let [items, setItems] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const readExcel = (file) => {
    // setItems([])
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;

        const wb = XLSX.read(bufferArray, { type: "buffer" });

        const wsname = wb.SheetNames[0];

        const ws = wb.Sheets[wsname];

        const data = XLSX.utils.sheet_to_json(ws);

        resolve(data);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then((d) => {
      d.forEach((item, index) => {
        item.status = "Chưa kiểm tra";
        if (typeof item.cmnd !== "undefined") item.cmnd = item.cmnd.toString();
      });
      setItems(d);

      console.log(d);
    });
  };
  const test_all = async () => {
    setisLoading(true);
    let cmnd_arr = [];
    let resp_arr = [];

    for (let index = 0; index < items.length; index++) {
      const element = items[index];
      cmnd_arr.push(element.cmnd);
      if ((index + 1) % 20 === 0) {
        try {
          let resp = await axios.post(
            "https://check-cmnd.herokuapp.com/api/check1",
            cmnd_arr
          );
          console.log(resp.data);
          resp.data.forEach((item) => {
            resp_arr.push(item);
          });
        } catch {
          alert(
            "Token đã hết hạn hoặc xảy ra lỗi, vui lòng liên hệ lập trình viên để cập nhật!"
          );
          setisLoading(false);
        }
        cmnd_arr = [];
      }
    }
    console.log(resp_arr);
    setItems(resp_arr);
    setisLoading(false);
  };
  const check_1 = async () => {
    setisLoading(true);
    let cmnd_arr = [];
    let resp_arr = [];

    for (let index = 0; index < items.length; index++) {
      const element = items[index];
      cmnd_arr.push(element.cmnd);
      if ((index + 1) % 20 === 0) {
        try {
          let resp = await axios.post(
            "https://check-cmnd.herokuapp.com/api/check1",
            cmnd_arr
          );
          console.log(resp.data);
          resp.data.forEach((item) => {
            resp_arr.push(item);
          });
        } catch {
          alert(
            "Token đã hết hạn hoặc xảy ra lỗi, vui lòng liên hệ lập trình viên để cập nhật!"
          );
          setisLoading(false);
        }
        cmnd_arr = [];
      }
    }
    console.log(resp_arr);
    setItems(resp_arr);
    setisLoading(false);
  };

  const check_2 = async () => {
    setisLoading(true);
    let cmnd_arr = [];
    let resp_arr = [];

    for (let index = 0; index < items.length; index++) {
      const element = items[index];
      cmnd_arr.push(element.cmnd);
      if ((index + 1) % 20 === 0) {
        try {
          let resp = await axios.post(
            "https://check-cmnd.herokuapp.com/api/check2",
            cmnd_arr
          );
          console.log(resp.data);
          resp.data.forEach((item) => {
            resp_arr.push(item);
          });
        } catch {
          alert(
            "Token đã hết hạn hoặc xảy ra lỗi, vui lòng liên hệ lập trình viên để cập nhật!"
          );
          setisLoading(false);
        }
        cmnd_arr = [];
      }
    }
    console.log(resp_arr);
    setItems(resp_arr);
    setisLoading(false);
  };
  const ex_excel = items.map((item, index) => {
    return (
      <tr>
        <th scope="row">{index + 1}</th>
        <td>{item.cmnd}</td>
        <td key={item.status}>{item.status}</td>
      </tr>
    );
  });
  let refresh = () => {
    // console.log(items)
    let check = 0;
    let count = 0;
    items.forEach((item) => {
      if (item.status === 0) {
        check = 1;
      } else {
        if (item.cmnd.charAt(0) === "0") item.cmnd = "x" + item.cmnd;
        count = count + 1;
      }
    });
    if (check === 1)
      alert(
        "Kiếm tra CMND chưa hoàn thành. Tiến độ: " +
          count +
          " / " +
          items.length
      );
    else {
      alert("Đã kiểm tra xong, nhấn Download file kết quả để tải về");
    }
    let arr = [...items];
    setItems(arr);
  };
  let headers = [
    { label: "cmnd/cccd", key: "cmnd" },
    { label: "Kết quả check", key: "status" },
  ];
  return (
    <div className="container">
      <div className="row">
        <div className="col-12" style={{ height: "50px" }}>
          {" "}
        </div>
        <div className="col-12">
          Một số lưu ý khi sử dụng tools: <br></br>
          1/ Chọn choose File để chọn file excel chứa cmnd. Cột chứa số
          CMND/CCCD phải đặt tên là "cmnd"
          <br />
          2/ File excel không giới hạn dòng. Nhưng số dòng cần là số chia hết
          cho 20. VD: 20, 40, 120, 280, 300, 400, 1020, ... <br />
          3/ Nhấn nút download để tải file kết quả về.
        </div>
        <div className="col-12" style={{ height: "50px" }}>
          {" "}
        </div>
        <div className="col-3"></div>
        <div className="col-6">
          <div class="input-group mb-3">
            <input
              class="form-control"
              placeholder=""
              aria-label="Example text with button addon"
              aria-describedby="button-addon1"
              type="file"
              onChange={(e) => {
                const file = e.target.files[0];
                readExcel(file);
              }}
            />
          </div>
        </div>
        {isLoading === false && (
          <div className="col-12">
            <button className="btn btn-primary" onClick={() => test_all()}>
              1. Check ZovayVn
            </button>
            <button className="btn btn-light" onClick={() => check_2()}>
              2. Check MaxdongVn
            </button>
            {/* <button className="btn btn-warning" onClick={() => refresh()} >Chỉ xuất chưa đăng ký</button> */}
            {/* <button className="btn btn-danger" onClick={() => refresh()} >Xuất tất cả</button> */}

            <CSVLink
              type="button"
              className="btn btn-danger"
              data={items}
              headers={headers}
              filename="Ket_Qua.csv"
            >
              3. Download file kết quả
            </CSVLink>
          </div>
        )}
        {isLoading === true ? (
          <div className="pt-5">
            <div class="spinner-grow text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <div class="spinner-grow text-secondary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <div class="spinner-grow text-success" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <div class="spinner-grow text-danger" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <div class="spinner-grow text-warning" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <div class="spinner-grow text-info" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <div class="spinner-grow text-light" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <div class="spinner-grow text-dark" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <table class="table">
            <thead>
              <tr>
                <th scope="col">STT</th>
                <th scope="col">CMND</th>
                <th scope="col">Tình trạng</th>
              </tr>
            </thead>
            <tbody>{ex_excel}</tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Home;
