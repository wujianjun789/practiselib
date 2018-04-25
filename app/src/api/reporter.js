import _ from 'lodash';
import { HOST_IP, getHttpHeader, httpRequest } from '../util/network';

// export function getHistoriesDataByAssetId(options) {
// 	let _url = `${HOST_IP}/histories`;
// 	_url += `?filter=${encodeURIComponent(JSON.stringify(options))}`;
// 	return fetch(_url, {
// 		headers: getHttpHeader(),
// 		method: 'GET'
// 	})
// 		.then(res => res.json());
// }

//统计-照明
export function getFaultCount(model, domainId, cb) {
  const param1 = JSON.stringify({
    where: {
      extendType: model,
      domainId
    }
  });
  const param2 = JSON.stringify({
    where: {
      model,
      domain_id: domainId
    }
  });
  httpRequest(
    HOST_IP + '/assets/count?filter=' + encodeURIComponent(param1),
    {
      headers: getHttpHeader(),
      method: 'GET'
    },
    response => {
      const deviceTotal = response.count;
      httpRequest(
        HOST_IP + '/faults/count?filter=' + encodeURIComponent(param2),
        {
          headers: getHttpHeader(),
          method: 'GET'
        },
        response => {
          const fault = response.count;
          cb && cb({ deviceTotal, fault });
        }
      );
    }
  );
}

export function getLightCount(model, domainId, cb) {
  const param1 = JSON.stringify({
    where: {
      model,
      domain_id: domainId,
      status: {
        online: 1
      }
    }
  });
  const param2 = JSON.stringify({
    where: {
      model,
      domain_id: domainId,
      status: {
        online: 1,
        brightness: {
          $gt: 0
        }
      }
    }
  });
  httpRequest(
    HOST_IP + '/statuses/count?' + encodeURIComponent(param1),
    {
      headers: getHttpHeader(),
      method: 'GET'
    },
    response => {
      const onlineTotal = response.count;
      httpRequest(
        HOST_IP + '/statuses/count?' + encodeURIComponent(param2),
        {
          headers: getHttpHeader(),
          method: 'GET'
        },
        response => {
          const light = response.count;
          cb && cb({ onlineTotal, light });
        }
      );
    }
  );
}

export function getHistoriesDataInDevice(
  mode,
  currentId,
  queryList,
  start,
  end,
  type,
  list,
  name,
  cb
) {
  const _querystring = JSON.stringify({
    where: {
      [mode]: currentId,
      or: queryList,
      timestamp: {
        between: [start, end]
      }
    }
  });
  const querystring = `/histories?filter=${_querystring}`;
  httpRequest(
    HOST_IP + querystring,
    {
      headers: getHttpHeader(),
      method: 'GET'
    },
    response => {
      if (!response.length) {
        cb && cb();
        return;
      }
      const _obj = _.groupBy(response, item => {
        return item[type];
      });
      const _data = [];
      const _arr = Object.keys(_obj);
      _arr.forEach(item => {
        let _item = {
          name: list[item][name],
          values: _obj[item]
        };
        _data.push(_item);
      });
      console.log(_data);
      cb && cb(_data);
    },
    undefined,
    err => {
      console.log(err);
    }
  );
}

export function getHistoriesDataInStat(mode, id, start, end, name, cb) {
  const _querystring = JSON.stringify({
    where: {
      dateTime: {
        between: [start, end]
      }
    }
  });
  const querystring = `/${mode}/${id}/statistic?filter=${_querystring}`;
  httpRequest(
    HOST_IP + querystring,
    {
      headers: getHttpHeader(),
      method: 'GET'
    },
    response => {
      if (!response.length) {
        cb && cb();
        return;
      }
      const _data = [];
      const _response = response.map(item => {
        return {
          timestamp: item['dateTime'],
          value: item.value
        };
      });
      const _obj = {
        name: name,
        values: _response
      };
      _data.push(_obj);
      cb && cb(_data);
    },
    undefined,
    err => {
      console.log(err);
    }
  );
}
