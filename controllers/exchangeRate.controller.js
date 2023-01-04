const ExchangeRate = require("../models/exchangeRate.model");
const cheerio = require("cheerio");
const request = require("request-promise");
const { response } = require("express");
const requests = require("../config/request.conf");

function doRequest(url) {
  return new Promise(function (resolve, reject) {
    request(url, (error, response, html) => {
      if (!error && response.statusCode === 200) {
        const $ = cheerio.load(html);

        const notifications = [];
        const buyCash = [];
        const dataCrawler = [];

        $("#table").each((index, el) => {
          const buyCashs = $(el) // crawler giá bán tiền mặt
            .find("tr")
            .find(
              "td[style='text-align: center; vertical-align: middle; width: 26%']"
            )
            .text()
            .replace(/\s+/g, " ")
            .split(" ");

          for (var i = 1; i <= buyCashs.length; i += 3) {
            buyCash.push(buyCashs[i]);
          }

          const notificationNumber = $(el) // crawler số lần thông báo
            .find(
              "#plcRoot_Layout_zoneContent_pageplaceholder_pageplaceholder_Layout_zoneLeft_ExchangeratesBIDV_lblLanthu"
            )
            .text();
          notifications.push(notificationNumber);

          const notificationDate = $(el) // crawler ngày thông báo
            .find(
              "#plcRoot_Layout_zoneContent_pageplaceholder_pageplaceholder_Layout_zoneLeft_ExchangeratesBIDV_lblDate"
            )
            .text();
          notifications.push(notificationDate);

          const notificationHourd = $(el) // crawler giờ thông báo
            .find(
              "#plcRoot_Layout_zoneContent_pageplaceholder_pageplaceholder_Layout_zoneLeft_ExchangeratesBIDV_lblTime"
            )
            .text();
          notifications.push(notificationHourd);
        });

        $("#contentInterestRates").each((index, el) => {
          const currencys = $(el) // crawler mã ngoại tệ
            .find("td.ngoaite_1")
            .text()
            .replace(/\s+/g, " ")
            .split(" ")
            .slice(1, 23);

          const buyTransfers = $(el) // crawler giá bán chuyển khoản
            .find("td.mua_1")
            .text()
            .replace(/\s+/g, " ")
            .split(" ")
            .slice(1, 23);

          const sellings = $(el) // crawler giá mua
            .find("td.ban_1")
            .text()
            .replace(/\s+/g, " ")
            .split(" ")
            .slice(1, 23);

          const currency = currencys.map((currency) => {
            return currency;
          });

          const buyTransfer = buyTransfers.map((buyTransfer) => {
            return buyTransfer;
          });

          const selling = sellings.map((selling) => {
            return selling;
          });

          dataCrawler.push({
            currency,
            buyCash,
            buyTransfer,
            selling,
            notifications,
          });
        });

        resolve(dataCrawler);
      } else {
        reject(error);
      }
    });
  });
}

function formatDB(array) {
  return array.map((item) => {
    const arr = item.currency.map(
      (el, i) =>
        i === item.buyCash[i] || {
          currency: el,
          buyCash: item.buyCash[i],
          buyTransfer: item.buyTransfer[i],
          selling: item.selling[i],
        }
    );

    return arr.map((row) => ({
      currency: row.currency,
      buyCash: row.buyCash?.replace(",", "").replace("-", 0),
      buyTransfer: row.buyTransfer?.replace(",", "").replace("-", 0),
      selling: row.selling?.replace(",", "").replace("-", 0),
    }));
  });
}

const update = async (req, res, next) => {
  const crawler = await doRequest(requests.URL);
  const data = formatDB(crawler);

  const notifications = await ExchangeRate.find();

  const checkNotifications = notifications.filter(
    (notification) =>
      notification.notificationNumber !== crawler[0]?.notifications[0] ||
      notification.notificationDate !== crawler[0]?.notifications[1]
  );

  if (checkNotifications.length > 0) {
    await data[0]?.map((row) => {
      return ExchangeRate.updateMany(
        { currency: row.currency },
        {
          currency: row.currency,
          buyCash: row.buyCash,
          buyTransfer: row.buyTransfer,
          selling: row.selling,
          notificationNumber: crawler[0].notifications[0],
          notificationDate: crawler[0].notifications[1],
          notificationHourd: crawler[0].notifications[2],
          updatedAt: Date.now(),
        }
      )
        .then(() => {
          return console.log("Cập nhật thành công " + row.currency + " .");
        })
        .catch((error) => {
          return console.log(error);
        });
    });
  }
};

// setInterval(update, 1000 * 60 * 1);

module.exports.getAll = async (req, res, next) => {
  await ExchangeRate.find()
    .where({ softDelete: "" })
    .sort({ sort: 1 })
    .exec((err, exchangeRates) => {
      if (err) return res.status(400).json(err);

      return res.status(200).json(exchangeRates.map(formatExchangeRate));
    });
};

function formatExchangeRate(data) {
  const {
    _id: id,
    ensign,
    currency,
    buyCash,
    buyTransfer,
    selling,
    sort,
    notificationNumber,
    notificationDate,
    notificationHourd,
    status,
  } = data;

  return {
    id,
    ensign,
    currency,
    buyCash,
    buyTransfer,
    selling,
    sort,
    notificationNumber,
    notificationDate,
    notificationHourd,
    status,
  };
}
