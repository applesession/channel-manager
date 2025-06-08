// note: Статусы могут использоваться для алгоритма, который высчитывает Priority

export interface IHealth {
  status: 'UP' | 'DOWN' | 'OUT_OF_SERVICE';
}
