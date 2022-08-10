<template>
  <button @click="editable = !editable">
    asdasd
  </button>
  <grid-layout
    v-model:layout="layout"
    :col-num="colNum"
    :row-height="rowHeight"
    :margin="margin"
    :is-draggable="editable"
    :is-resizable="editable"
    vertical-compact
    use-css-transforms
  >
    <template #item="slotProps">
      {{ slotProps.item.i }}
      <div>
        asdasdasd
      </div>
    </template>
  </grid-layout>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',
  data () {
    return {
      editable: false,
      colNum: 3,
      layout: [{
        _listeners: [],
        x: 0,
        y: 0,
        w: 1,
        h: 1,
        i: 1,
        _records: -1,
        _timeSlug: null,
        _meta: {
          report: 'flows',
          shared: true,
          options: null,
          timeInterval: 60,
          description: null,
          parameters: '{"orderby":"ts","order":"ascending","groupby":["ts"],"aggregateFunction":"sum","rateUnit":"seconds","aggregateBy":"octets","isolateEmptySpaces":1}',
          id: 1,
          owner: 'Firstname Lastname',
          name: 'Total traffic throughput',
          graphType: 'area'
        },
        _parameters: {
          orderby: 'ts',
          order: 'ascending',
          groupby: ['ts'],
          aggregateFunction: 'sum',
          rateUnit: 'seconds',
          aggregateBy: 'octets',
          isolateEmptySpaces: 1
        },
        _options: {
          legend: { align: 'left', enabled: true, floating: false, useHtml: true, verticalAlign: 'bottom' },
          measure: 'bits',
          stacked: false,
          type: 'area'
        },
        _additional: { device: [], site: [] },
        _tokens: { meta: null },
        _busy: false,
        _error: '',
        _placeholder: false,
        _original: { h: 1, id: 1, x: 0, y: 0, w: 1 },
        moved: false,
        name: 'Total traffic throughput'
      }, {
        _listeners: [],
        x: 1,
        y: 0,
        w: 1,
        h: 1,
        i: 2,
        _records: -1,
        _timeSlug: null,
        _meta: {
          report: 'flows',
          shared: true,
          options: null,
          timeInterval: 60,
          description: null,
          parameters: '{"orderby":"ts","order":"ascending","groupby":["ts"],"aggregateFunction":"sum","rateUnit":"seconds","aggregateBy":"packets","isolateEmptySpaces":1}',
          id: 2,
          owner: 'Firstname Lastname',
          name: 'Total packets throughput',
          graphType: 'area'
        },
        _parameters: {
          orderby: 'ts',
          order: 'ascending',
          groupby: ['ts'],
          aggregateFunction: 'sum',
          rateUnit: 'seconds',
          aggregateBy: 'packets',
          isolateEmptySpaces: 1
        },
        _options: {
          legend: { align: 'left', enabled: true, floating: false, useHtml: true, verticalAlign: 'bottom' },
          measure: 'bits',
          stacked: false,
          type: 'area'
        },
        _additional: { device: [], site: [] },
        _tokens: { meta: null },
        _busy: false,
        _error: '',
        _placeholder: false,
        _original: { h: 1, id: 2, x: 1, y: 0, w: 1 },
        moved: false,
        name: 'Total packets throughput'
      }, {
        _listeners: [],
        x: 2,
        y: 0,
        w: 1,
        h: 1,
        i: 3,
        _records: -1,
        _timeSlug: null,
        _meta: {
          report: 'flows',
          shared: true,
          options: null,
          timeInterval: 60,
          description: null,
          parameters: '{"orderby":"ts","order":"ascending","groupby":["ip-version","ts"],"aggregateBy":"octets","rateUnit":"seconds","aggregateFunction":"sum","top":10,"isolateEmptySpaces":1}',
          id: 3,
          owner: 'Firstname Lastname',
          name: 'Traffic throughput by IP version',
          graphType: 'area'
        },
        _parameters: {
          orderby: 'ts',
          order: 'ascending',
          groupby: ['ip-version', 'ts'],
          aggregateBy: 'octets',
          rateUnit: 'seconds',
          aggregateFunction: 'sum',
          top: 10,
          isolateEmptySpaces: 1
        },
        _options: {
          legend: { align: 'left', enabled: true, floating: false, useHtml: true, verticalAlign: 'bottom' },
          measure: 'bits',
          stacked: false,
          type: 'area'
        },
        _additional: { device: [], site: [] },
        _tokens: { meta: null },
        _busy: false,
        _error: '',
        _placeholder: false,
        _original: { h: 1, id: 3, x: 2, y: 0, w: 1 },
        moved: false,
        name: 'Traffic throughput by IP version'
      }, {
        _listeners: [],
        x: 0,
        y: 1,
        w: 1,
        h: 1,
        i: 4,
        _records: -1,
        _timeSlug: null,
        _meta: {
          report: 'flows',
          shared: true,
          options: null,
          timeInterval: 60,
          description: null,
          parameters: '{"orderby":"ts","order":"ascending","groupby":["protocol","ts"],"aggregateBy":"octets","rateUnit":"seconds","aggregateFunction":"sum","top":10,"isolateEmptySpaces":1}',
          id: 4,
          owner: 'Firstname Lastname',
          name: 'Top throughput by protocols',
          graphType: 'line'
        },
        _parameters: {
          orderby: 'ts',
          order: 'ascending',
          groupby: ['protocol', 'ts'],
          aggregateBy: 'octets',
          rateUnit: 'seconds',
          aggregateFunction: 'sum',
          top: 10,
          isolateEmptySpaces: 1
        },
        _options: {
          legend: { align: 'left', enabled: true, floating: false, useHtml: true, verticalAlign: 'bottom' },
          measure: 'bits',
          stacked: false,
          type: 'area'
        },
        _additional: { device: [], site: [] },
        _tokens: { meta: null },
        _busy: false,
        _error: '',
        _placeholder: false,
        _original: { h: 1, id: 4, x: 0, y: 1, w: 1 },
        moved: false,
        name: 'Top throughput by protocols'
      }, {
        _listeners: [],
        x: 1,
        y: 1,
        w: 1,
        h: 1,
        i: 5,
        _records: -1,
        _timeSlug: null,
        _meta: {
          report: 'flows',
          shared: true,
          options: null,
          timeInterval: 60,
          description: null,
          parameters: '{"orderby":"ts","order":"ascending","groupby":["next-hop","ts"],"aggregateBy":"octets","rateUnit":"seconds","aggregateFunction":"sum","top":10,"isolateEmptySpaces":1}',
          id: 5,
          owner: 'Firstname Lastname',
          name: 'Traffic throughput by next-hop',
          graphType: 'line'
        },
        _parameters: {
          orderby: 'ts',
          order: 'ascending',
          groupby: ['next-hop', 'ts'],
          aggregateBy: 'octets',
          rateUnit: 'seconds',
          aggregateFunction: 'sum',
          top: 10,
          isolateEmptySpaces: 1
        },
        _options: {
          legend: { align: 'left', enabled: true, floating: false, useHtml: true, verticalAlign: 'bottom' },
          measure: 'bits',
          stacked: false,
          type: 'area'
        },
        _additional: { device: [], site: [] },
        _tokens: { meta: null },
        _busy: false,
        _error: '',
        _placeholder: false,
        _original: { h: 1, id: 5, x: 1, y: 1, w: 1 },
        moved: false,
        name: 'Traffic throughput by next-hop'
      }, {
        _listeners: [],
        x: 2,
        y: 1,
        w: 1,
        h: 1,
        i: 6,
        _records: -1,
        _timeSlug: null,
        _meta: {
          report: 'flows',
          shared: true,
          options: null,
          timeInterval: 60,
          description: null,
          parameters: '{"groupby":["as-path"],"order":"ascending","orderby":"octets","aggregateBy":"octets","aggregateFunction":"sum","top":10,"asPathPrependRemove":1}',
          id: 6,
          owner: 'Firstname Lastname',
          name: 'Traffic throughput by AS path (BGP)',
          graphType: 'sankey'
        },
        _parameters: {
          groupby: ['as-path'],
          order: 'ascending',
          orderby: 'octets',
          aggregateBy: 'octets',
          aggregateFunction: 'sum',
          top: 10,
          asPathPrependRemove: 1
        },
        _options: {
          legend: { align: 'left', enabled: true, floating: false, useHtml: true, verticalAlign: 'bottom' },
          measure: 'bits',
          stacked: false,
          type: 'area'
        },
        _additional: { device: [], site: [] },
        _tokens: { meta: null },
        _busy: false,
        _error: '',
        _placeholder: false,
        _original: { h: 1, id: 6, x: 2, y: 1, w: 1 },
        moved: false,
        name: 'Traffic throughput by AS path (BGP)'
      }, {
        _listeners: [],
        x: 0,
        y: 2,
        w: 1,
        h: 1,
        i: 7,
        _records: -1,
        _timeSlug: null,
        _meta: {
          report: 'flows',
          shared: true,
          options: null,
          timeInterval: 60,
          description: null,
          parameters: '{"groupby":["src-addr","dst-addr","ts"],"order":"ascending","orderby":"ts","aggregateBy":"octets","aggregateFunction":"sum","top":10,"isolateEmptySpaces":1}',
          id: 7,
          owner: 'Firstname Lastname',
          name: 'Top conversations',
          graphType: 'line'
        },
        _parameters: {
          groupby: ['src-addr', 'dst-addr', 'ts'],
          order: 'ascending',
          orderby: 'ts',
          aggregateBy: 'octets',
          aggregateFunction: 'sum',
          top: 10,
          isolateEmptySpaces: 1
        },
        _options: {
          legend: { align: 'left', enabled: true, floating: false, useHtml: true, verticalAlign: 'bottom' },
          measure: 'bits',
          stacked: false,
          type: 'area'
        },
        _additional: { device: [], site: [] },
        _tokens: { meta: null },
        _busy: false,
        _error: '',
        _placeholder: false,
        _original: { h: 1, id: 7, x: 0, y: 2, w: 1 },
        moved: false,
        name: 'Top conversations'
      }, {
        _listeners: [],
        x: 1,
        y: 2,
        w: 1,
        h: 1,
        i: 8,
        _records: -1,
        _timeSlug: null,
        _meta: {
          report: 'flows',
          shared: true,
          options: null,
          timeInterval: 60,
          description: null,
          parameters: '{"groupby":["tos","ts"],"order":"ascending","orderby":"ts","aggregateBy":"octets","rateUnit":"seconds","aggregateFunction":"sum","top":10,"isolateEmptySpaces":1}',
          id: 8,
          owner: 'Firstname Lastname',
          name: 'Top Types of Service',
          graphType: 'line'
        },
        _parameters: {
          groupby: ['tos', 'ts'],
          order: 'ascending',
          orderby: 'ts',
          aggregateBy: 'octets',
          rateUnit: 'seconds',
          aggregateFunction: 'sum',
          top: 10,
          isolateEmptySpaces: 1
        },
        _options: {
          legend: { align: 'left', enabled: true, floating: false, useHtml: true, verticalAlign: 'bottom' },
          measure: 'bits',
          stacked: false,
          type: 'area'
        },
        _additional: { device: [], site: [] },
        _tokens: { meta: null },
        _busy: false,
        _error: '',
        _placeholder: false,
        _original: { h: 1, id: 8, x: 1, y: 2, w: 1 },
        moved: false,
        name: 'Top Types of Service'
      }, {
        _listeners: [],
        x: 2,
        y: 2,
        w: 1,
        h: 1,
        i: 1000,
        _records: -1,
        _timeSlug: null,
        _meta: {
          report: 'flows',
          shared: true,
          options: null,
          timeInterval: 60,
          description: null,
          parameters: '{"aggregateBy":"octets","aggregateFunction":"sum","top":10,"orderby":"ts","filters":"{\\"condition\\":\\"and\\",\\"rules\\":[{\\"comparisonOperator\\":\\"eq\\",\\"key\\":\\"ip-version\\",\\"value\\":\\"4\\"}]}","groupby":["ts","src-addr"],"order":"ascending","rateUnit":"seconds","isolateEmptySpaces":1}',
          id: 1000,
          owner: 'Firstname Lastname',
          name: 'Top Source IPv4 Addresses',
          graphType: 'line'
        },
        _parameters: {
          aggregateBy: 'octets',
          aggregateFunction: 'sum',
          top: 10,
          orderby: 'ts',
          filters: '{"condition":"and","rules":[{"comparisonOperator":"eq","key":"ip-version","value":"4"}]}',
          groupby: ['ts', 'src-addr'],
          order: 'ascending',
          rateUnit: 'seconds',
          isolateEmptySpaces: 1
        },
        _options: {
          legend: { align: 'left', enabled: true, floating: false, useHtml: true, verticalAlign: 'bottom' },
          measure: 'bits',
          stacked: false,
          type: 'area'
        },
        _additional: { device: [], site: [] },
        _tokens: { meta: null },
        _busy: false,
        _error: '',
        _placeholder: false,
        _original: { h: 1, id: 1000, x: 2, y: 2, w: 1 },
        moved: false,
        name: 'Top Source IPv4 Addresses'
      }, {
        _listeners: [],
        x: 0,
        y: 3,
        w: 1,
        h: 1,
        i: 1001,
        _records: -1,
        _timeSlug: null,
        _meta: {
          report: 'flows',
          shared: true,
          options: null,
          timeInterval: 60,
          description: null,
          parameters: '{"aggregateBy":"octets","aggregateFunction":"sum","top":10,"orderby":"ts","filters":"{\\"condition\\":\\"and\\",\\"rules\\":[{\\"comparisonOperator\\":\\"eq\\",\\"key\\":\\"ip-version\\",\\"value\\":\\"6\\"}]}","groupby":["ts","src-addr"],"order":"ascending","rateUnit":"seconds","isolateEmptySpaces":1}',
          id: 1001,
          owner: 'Firstname Lastname',
          name: 'Top Source IPv6 Addresses',
          graphType: 'line'
        },
        _parameters: {
          aggregateBy: 'octets',
          aggregateFunction: 'sum',
          top: 10,
          orderby: 'ts',
          filters: '{"condition":"and","rules":[{"comparisonOperator":"eq","key":"ip-version","value":"6"}]}',
          groupby: ['ts', 'src-addr'],
          order: 'ascending',
          rateUnit: 'seconds',
          isolateEmptySpaces: 1
        },
        _options: {
          legend: { align: 'left', enabled: true, floating: false, useHtml: true, verticalAlign: 'bottom' },
          measure: 'bits',
          stacked: false,
          type: 'area'
        },
        _additional: { device: [], site: [] },
        _tokens: { meta: null },
        _busy: false,
        _error: '',
        _placeholder: false,
        _original: { h: 1, id: 1001, x: 0, y: 3, w: 1 },
        moved: false,
        name: 'Top Source IPv6 Addresses'
      }, {
        _listeners: [],
        x: 1,
        y: 3,
        w: 1,
        h: 1,
        i: 1002,
        _records: -1,
        _timeSlug: null,
        _meta: {
          report: 'flows',
          shared: true,
          options: null,
          timeInterval: 60,
          description: null,
          parameters: '{"aggregateBy":"octets","aggregateFunction":"sum","top":10,"orderby":"ts","filters":"{\\"condition\\":\\"and\\",\\"rules\\":[{\\"comparisonOperator\\":\\"eq\\",\\"key\\":\\"ip-version\\",\\"value\\":\\"4\\"}]}","groupby":["ts","dst-addr"],"order":"ascending","rateUnit":"seconds","isolateEmptySpaces":1}',
          id: 1002,
          owner: 'Firstname Lastname',
          name: 'Top Destination IPv4 Addresses',
          graphType: 'line'
        },
        _parameters: {
          aggregateBy: 'octets',
          aggregateFunction: 'sum',
          top: 10,
          orderby: 'ts',
          filters: '{"condition":"and","rules":[{"comparisonOperator":"eq","key":"ip-version","value":"4"}]}',
          groupby: ['ts', 'dst-addr'],
          order: 'ascending',
          rateUnit: 'seconds',
          isolateEmptySpaces: 1
        },
        _options: {
          legend: { align: 'left', enabled: true, floating: false, useHtml: true, verticalAlign: 'bottom' },
          measure: 'bits',
          stacked: false,
          type: 'area'
        },
        _additional: { device: [], site: [] },
        _tokens: { meta: null },
        _busy: false,
        _error: '',
        _placeholder: false,
        _original: { h: 1, id: 1002, x: 1, y: 3, w: 1 },
        moved: false,
        name: 'Top Destination IPv4 Addresses'
      }, {
        _listeners: [],
        x: 2,
        y: 3,
        w: 1,
        h: 1,
        i: 1003,
        _records: -1,
        _timeSlug: null,
        _meta: {
          report: 'flows',
          shared: true,
          options: null,
          timeInterval: 60,
          description: null,
          parameters: '{"aggregateBy":"octets","aggregateFunction":"sum","top":10,"orderby":"ts","filters":"{\\"condition\\":\\"and\\",\\"rules\\":[{\\"comparisonOperator\\":\\"eq\\",\\"key\\":\\"ip-version\\",\\"value\\":\\"6\\"}]}","groupby":["ts","dst-addr"],"order":"ascending","rateUnit":"seconds","isolateEmptySpaces":1}',
          id: 1003,
          owner: 'Firstname Lastname',
          name: 'Top Destination IPv6 Addresses',
          graphType: 'line'
        },
        _parameters: {
          aggregateBy: 'octets',
          aggregateFunction: 'sum',
          top: 10,
          orderby: 'ts',
          filters: '{"condition":"and","rules":[{"comparisonOperator":"eq","key":"ip-version","value":"6"}]}',
          groupby: ['ts', 'dst-addr'],
          order: 'ascending',
          rateUnit: 'seconds',
          isolateEmptySpaces: 1
        },
        _options: {
          legend: { align: 'left', enabled: true, floating: false, useHtml: true, verticalAlign: 'bottom' },
          measure: 'bits',
          stacked: false,
          type: 'area'
        },
        _additional: { device: [], site: [] },
        _tokens: { meta: null },
        _busy: false,
        _error: '',
        _placeholder: false,
        _original: { h: 1, id: 1003, x: 2, y: 3, w: 1 },
        moved: false,
        name: 'Top Destination IPv6 Addresses'
      }, {
        _listeners: [],
        x: 0,
        y: 4,
        w: 1,
        h: 1,
        i: 1004,
        _records: -1,
        _timeSlug: null,
        _meta: {
          report: 'flows',
          shared: true,
          options: null,
          timeInterval: 60,
          description: null,
          parameters: '{"aggregateBy":"octets","aggregateFunction":"sum","top":10,"orderby":"ts","groupby":["ts","src-country"],"order":"ascending","rateUnit":"seconds","isolateEmptySpaces":1}',
          id: 1004,
          owner: 'Firstname Lastname',
          name: 'Top Destination Countries',
          graphType: 'line'
        },
        _parameters: {
          aggregateBy: 'octets',
          aggregateFunction: 'sum',
          top: 10,
          orderby: 'ts',
          groupby: ['ts', 'src-country'],
          order: 'ascending',
          rateUnit: 'seconds',
          isolateEmptySpaces: 1
        },
        _options: {
          legend: { align: 'left', enabled: true, floating: false, useHtml: true, verticalAlign: 'bottom' },
          measure: 'bits',
          stacked: false,
          type: 'area'
        },
        _additional: { device: [], site: [] },
        _tokens: { meta: null },
        _busy: false,
        _error: '',
        _placeholder: false,
        _original: { h: 1, id: 1004, x: 0, y: 4, w: 1 },
        moved: false,
        name: 'Top Destination Countries'
      }, {
        _listeners: [],
        x: 1,
        y: 4,
        w: 1,
        h: 1,
        i: 1005,
        _records: -1,
        _timeSlug: null,
        _meta: {
          report: 'flows',
          shared: true,
          options: null,
          timeInterval: 60,
          description: null,
          parameters: '{"aggregateBy":"octets","aggregateFunction":"sum","top":10,"orderby":"ts","groupby":["ts","src-country","dst-country"],"order":"ascending","rateUnit":"seconds","isolateEmptySpaces":1}',
          id: 1005,
          owner: 'Firstname Lastname',
          name: 'Top Speaking Countries',
          graphType: 'line'
        },
        _parameters: {
          aggregateBy: 'octets',
          aggregateFunction: 'sum',
          top: 10,
          orderby: 'ts',
          groupby: ['ts', 'src-country', 'dst-country'],
          order: 'ascending',
          rateUnit: 'seconds',
          isolateEmptySpaces: 1
        },
        _options: {
          legend: { align: 'left', enabled: true, floating: false, useHtml: true, verticalAlign: 'bottom' },
          measure: 'bits',
          stacked: false,
          type: 'area'
        },
        _additional: { device: [], site: [] },
        _tokens: { meta: null },
        _busy: false,
        _error: '',
        _placeholder: false,
        _original: { h: 1, id: 1005, x: 1, y: 4, w: 1 },
        moved: false,
        name: 'Top Speaking Countries'
      }],
      margin: [10, 10],
      responsiveLayouts: {
        lg: [{
          h: 8,
          i: 0,
          static: true,
          w: 5,
          x: 0,
          y: 0
        },
        {
          h: 20,
          i: 1,
          w: 8,
          x: 2,
          y: 0
        },
        {
          h: 5,
          i: 2,
          w: 2,
          x: 4,
          y: 0
        },
        {
          h: 3,
          i: 3,
          w: 2,
          x: 6,
          y: 0
        },
        {
          h: 3,
          i: 4,
          w: 2,
          x: 8,
          y: 0
        },
        {
          h: 3,
          i: 5,
          w: 2,
          x: 10,
          y: 0
        },
        {
          h: 5,
          i: 6,
          w: 2,
          x: 0,
          y: 5
        },
        {
          h: 5,
          i: 7,
          w: 2,
          x: 2,
          y: 5
        },
        {
          h: 5,
          i: 8,
          w: 2,
          x: 4,
          y: 5
        },
        {
          h: 4,
          i: 9,
          w: 2,
          x: 6,
          y: 3
        },
        {
          h: 4,
          i: 10,
          w: 2,
          x: 8,
          y: 4
        },
        {
          h: 4,
          i: 11,
          w: 2,
          x: 10,
          y: 4
        },
        {
          h: 5,
          i: 12,
          w: 2,
          x: 0,
          y: 10
        },
        {
          h: 5,
          i: 13,
          w: 2,
          x: 2,
          y: 10
        },
        {
          h: 4,
          i: 14,
          w: 2,
          x: 4,
          y: 8
        },
        {
          h: 4,
          i: 15,
          w: 2,
          x: 6,
          y: 8
        },
        {
          h: 5,
          i: 16,
          w: 2,
          x: 8,
          y: 10
        },
        {
          h: 2,
          i: 17,
          w: 2,
          x: 10,
          y: 4
        },
        {
          h: 3,
          i: 18,
          w: 2,
          x: 0,
          y: 9
        },
        {
          h: 2,
          i: 19,
          w: 2,
          x: 2,
          y: 6
        }],
        md: [{
          h: 2,
          i: 0,
          static: true,
          w: 5,
          x: 0,
          y: 0
        },
        {
          h: 4,
          i: 1,
          w: 2,
          x: 2,
          y: 0
        },
        {
          h: 5,
          i: 2,
          w: 2,
          x: 4,
          y: 0
        },
        {
          h: 3,
          i: 3,
          w: 2,
          x: 6,
          y: 0
        },
        {
          h: 3,
          i: 4,
          w: 2,
          x: 8,
          y: 0
        },
        {
          h: 3,
          i: 5,
          w: 2,
          x: 10,
          y: 0
        },
        {
          h: 5,
          i: 6,
          w: 2,
          x: 0,
          y: 5
        },
        {
          h: 5,
          i: 7,
          w: 2,
          x: 2,
          y: 5
        },
        {
          h: 5,
          i: 8,
          w: 2,
          x: 4,
          y: 5
        },
        {
          h: 4,
          i: 9,
          w: 2,
          x: 6,
          y: 3
        },
        {
          h: 4,
          i: 10,
          w: 2,
          x: 8,
          y: 4
        },
        {
          h: 4,
          i: 11,
          w: 2,
          x: 10,
          y: 4
        },
        {
          h: 5,
          i: 12,
          w: 2,
          x: 0,
          y: 10
        },
        {
          h: 5,
          i: 13,
          w: 2,
          x: 2,
          y: 10
        },
        {
          h: 4,
          i: 14,
          w: 2,
          x: 4,
          y: 8
        },
        {
          h: 4,
          i: 15,
          w: 2,
          x: 6,
          y: 8
        },
        {
          h: 5,
          i: 16,
          w: 2,
          x: 8,
          y: 10
        },
        {
          h: 2,
          i: 17,
          w: 2,
          x: 10,
          y: 4
        },
        {
          h: 3,
          i: 18,
          w: 2,
          x: 0,
          y: 9
        },
        {
          h: 2,
          i: 19,
          w: 2,
          x: 2,
          y: 6
        }],
        sm: [{
          h: 2,
          i: 0,
          static: true,
          w: 2,
          x: 0,
          y: 0
        },
        {
          h: 4,
          i: 1,
          w: 2,
          x: 2,
          y: 0
        },
        {
          h: 5,
          i: 2,
          w: 2,
          x: 4,
          y: 0
        },
        {
          h: 3,
          i: 3,
          w: 2,
          x: 6,
          y: 0
        },
        {
          h: 3,
          i: 4,
          w: 2,
          x: 8,
          y: 0
        },
        {
          h: 3,
          i: 5,
          w: 2,
          x: 10,
          y: 0
        },
        {
          h: 5,
          i: 6,
          w: 2,
          x: 0,
          y: 5
        },
        {
          h: 5,
          i: 7,
          w: 2,
          x: 2,
          y: 5
        },
        {
          h: 5,
          i: 8,
          w: 2,
          x: 4,
          y: 5
        },
        {
          h: 4,
          i: 9,
          w: 2,
          x: 6,
          y: 3
        },
        {
          h: 4,
          i: 10,
          w: 2,
          x: 8,
          y: 4
        },
        {
          h: 4,
          i: 11,
          w: 2,
          x: 10,
          y: 4
        },
        {
          h: 5,
          i: 12,
          w: 2,
          x: 0,
          y: 10
        },
        {
          h: 5,
          i: 13,
          w: 2,
          x: 2,
          y: 10
        },
        {
          h: 4,
          i: 14,
          w: 2,
          x: 4,
          y: 8
        },
        {
          h: 4,
          i: 15,
          w: 2,
          x: 6,
          y: 8
        },
        {
          h: 5,
          i: 16,
          w: 2,
          x: 8,
          y: 10
        },
        {
          h: 2,
          i: 17,
          w: 2,
          x: 10,
          y: 4
        },
        {
          h: 3,
          i: 18,
          w: 2,
          x: 0,
          y: 9
        },
        {
          h: 2,
          i: 19,
          w: 2,
          x: 2,
          y: 6
        }],
        xs: [{
          h: 2,
          i: 0,
          static: true,
          w: 2,
          x: 0,
          y: 0
        },
        {
          h: 4,
          i: 1,
          w: 2,
          x: 2,
          y: 0
        },
        {
          h: 5,
          i: 2,
          w: 2,
          x: 4,
          y: 0
        },
        {
          h: 3,
          i: 3,
          w: 2,
          x: 6,
          y: 0
        },
        {
          h: 3,
          i: 4,
          w: 2,
          x: 8,
          y: 0
        },
        {
          h: 3,
          i: 5,
          w: 2,
          x: 10,
          y: 0
        },
        {
          h: 5,
          i: 6,
          w: 2,
          x: 0,
          y: 5
        },
        {
          h: 5,
          i: 7,
          w: 2,
          x: 2,
          y: 5
        },
        {
          h: 5,
          i: 8,
          w: 2,
          x: 4,
          y: 5
        },
        {
          h: 4,
          i: 9,
          w: 2,
          x: 6,
          y: 3
        },
        {
          h: 4,
          i: 10,
          w: 2,
          x: 8,
          y: 4
        },
        {
          h: 4,
          i: 11,
          w: 2,
          x: 10,
          y: 4
        },
        {
          h: 5,
          i: 12,
          w: 2,
          x: 0,
          y: 10
        },
        {
          h: 5,
          i: 13,
          w: 2,
          x: 2,
          y: 10
        },
        {
          h: 4,
          i: 14,
          w: 2,
          x: 4,
          y: 8
        },
        {
          h: 4,
          i: 15,
          w: 2,
          x: 6,
          y: 8
        },
        {
          h: 5,
          i: 16,
          w: 2,
          x: 8,
          y: 10
        },
        {
          h: 2,
          i: 17,
          w: 2,
          x: 10,
          y: 4
        },
        {
          h: 3,
          i: 18,
          w: 2,
          x: 0,
          y: 9
        },
        {
          h: 2,
          i: 19,
          w: 2,
          x: 2,
          y: 6
        }],
        xxs: [{
          h: 2,
          i: 0,
          static: true,
          w: 2,
          x: 0,
          y: 0
        },
        {
          h: 4,
          i: 1,
          w: 2,
          x: 2,
          y: 0
        },
        {
          h: 5,
          i: 2,
          w: 2,
          x: 4,
          y: 0
        },
        {
          h: 3,
          i: 3,
          w: 2,
          x: 6,
          y: 0
        },
        {
          h: 3,
          i: 4,
          w: 2,
          x: 8,
          y: 0
        },
        {
          h: 3,
          i: 5,
          w: 2,
          x: 10,
          y: 0
        },
        {
          h: 5,
          i: 6,
          w: 2,
          x: 0,
          y: 5
        },
        {
          h: 5,
          i: 7,
          w: 2,
          x: 2,
          y: 5
        },
        {
          h: 5,
          i: 8,
          w: 2,
          x: 4,
          y: 5
        },
        {
          h: 4,
          i: 9,
          w: 2,
          x: 6,
          y: 3
        },
        {
          h: 4,
          i: 10,
          w: 2,
          x: 8,
          y: 4
        },
        {
          h: 4,
          i: 11,
          w: 2,
          x: 10,
          y: 4
        },
        {
          h: 5,
          i: 12,
          w: 2,
          x: 0,
          y: 10
        },
        {
          h: 5,
          i: 13,
          w: 2,
          x: 2,
          y: 10
        },
        {
          h: 4,
          i: 14,
          w: 2,
          x: 4,
          y: 8
        },
        {
          h: 4,
          i: 15,
          w: 2,
          x: 6,
          y: 8
        },
        {
          h: 5,
          i: 16,
          w: 2,
          x: 8,
          y: 10
        },
        {
          h: 2,
          i: 17,
          w: 2,
          x: 10,
          y: 4
        },
        {
          h: 3,
          i: 18,
          w: 2,
          x: 0,
          y: 9
        },
        {
          h: 2,
          i: 19,
          w: 2,
          x: 2,
          y: 6
        }]
      },
      rowHeight: 30
    }
  },
  mounted () {
    setTimeout(() => {
      // this.rowHeight = 50
    }, 5000)
  }
})
</script>

<!-- <style lang="scss"> -->
<!-- </style> -->
