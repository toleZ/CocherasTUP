export interface Paginate {
  curPage: number;
  itemsPerPage: 10 | 15 | 20;
  totalPages: number;
  pagesToShow: number[];
}
