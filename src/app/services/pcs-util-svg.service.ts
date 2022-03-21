import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class PcsUtilSVG {

  constructor() { }

  public static menuSIG: string = `<mat-icon  style="color:#595959" class="mat-icon svg-icon notranslate material-icons mat-icon-no-color">construction</mat-icon>`
  public static filtroSIG: string = `<mat-icon  style="color:#595959" class="mat-icon svg-icon notranslate material-icons mat-icon-no-color">filter_alt</mat-icon>`

  // public static menuSIG: string = `<mat-icon  svgIcon="file-export" class="mat-icon svg-icon notranslate material-icons mat-icon-no-color" style="line-height: .6;">
  // <?xml version="1.0" encoding="UTF-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
  // <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="24px" height="24px" viewBox="0 0 24 24" enable-background="new 0 0 24 24" xml:space="preserve">  <image id="image0" width="24" height="24" x="0" y="0"
  // href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYEAQAAAAa7ikwAAAABGdBTUEAALGPC/xhBQAAAAJiS0dE
  // //8UqzHNAAAAB3RJTUUH5QQbDw4sX8JQnwAABAdJREFUSMfNlH1MlWUYxn/vfc6Jo3xOWJxIyBA5
  // JGhAliLg1OkiMLOEJX5MUmJtaZ2llWxklMga5SKXFqILC2duEkxFsTRnw0QjEGMIQkjBgAAnjg7E
  // xzlvfxzgAAppf7Tu7d7ePc99Xddz3ffzPvD/CsmFKVXg2wQzjGCIBl3rRAjtvRHrz0HEWVj4K7gG
  // Qu+foDwODi9A/0vwczMUPQQdylik8s/kj+4FUz94x0HeA1CdBf1nocEdrFEwbS8srYWAt+FQLfwQ
  // BGwdQmsmJjcWQk4zhCSCnAaXb8AzHp7YA7fNULcP2lqgpBdupkF6CdwyQM13w00dn3yKEXath/Ct
  // 4FUMgTWgHgPtGgj+Hm7G22uDusDrOgwkQMqPMGfRPQiszYClFbbvyc9Aqw/M9ISwZDgVCtbV9lr3
  // DNhgAadOMEbAlhTQPzhBazxi4FsXMFtBVW1pLoSc92BaAEgjcHBwjEZIrYcvwmB1DJh84MR2CP9s
  // gls0KwfKZ8Bv7rAqEr6+DM074EgHNFQD3vbagDRYtgpmR0BoNDRVgkcwRB6AC+M52BgKa6PA/xPI
  // 1UBSMkw9effaXcF2lyPz4EVQ1o3jwLEM2jvhuhuY8mD+WxBZCb7zoMUFTmihbVCw5Qp0t4PlZXAC
  // lALbumsEaDrHcZD4C8QnjBm6K/TqwFIKebvBOA1018A5GyL9YEExlO20O8jtBnEcRSECuiAlWVm+
  // I1fx/6j0sRU8rPQN7SZdhYHjNvCACX7vhpVeow+RvtIu8O6SYVJbTq0QWRwryiMdoqvOVtSKc0qt
  // T5xoliSIwTAJnDtg3zywltkIOj+AMO/RAiaDba/rBixeNEbgQ6tIV7VI8WSRnlbF8tdspf+iQcTs
  // JpK6maMAC05Ctyf0fw7bskG/Z7RA9E7oWwGFSeBYNUYgNl+kJ1PEel6k3k/kRoOIul2k65JI9KeK
  // A8CsNmjPhEvO4P3snbMz9sHlM7Do6qi+i4R0iGS8ItLrKnLaKOL7tIj/6yLny0XMZpG098U9aDN4
  // HINTkyDCcCe5dwF8/Aas14MSMEJAqRP5qk1EVW1pOmx3lXJGRFVFq6pKXlEczFwIm6IgNMSG1jSB
  // VwGs2Qj750KsB2gCR8pqQfWD3DbQVkJcJMw9BG560ByHJ6dD3zV0h4t4s6oHko6Athi8VVgeA87v
  // wKTpUOcE6buhPhLoGCmgyPBzF1UCRzXgcAB+qgGNBeZUQpcRnrultpyvVj31jeC1BTzmgyYUOs3Q
  // nAq3nwe23fWXsrcj00FkYJNI7Wsi/YkivUUitetELHqRtA1DdfcbI56K/Y1wJQvKl0F+OPQEwIsq
  // PPUHXPjy/qkHWzTWDehK4dUB6MuHLGewpFit/5b+P4i/ATpKUQvaUMv9AAAAJXRFWHRkYXRlOmNy
  // ZWF0ZQAyMDIxLTA0LTI3VDE1OjE0OjQ0KzAwOjAw41lgVAAAACV0RVh0ZGF0ZTptb2RpZnkAMjAy
  // MS0wNC0yN1QxNToxNDo0NCswMDowMJIE2OgAAAAASUVORK5CYII=" />
  // </svg>
  // </mat-icon>`
  
  
  // public static filtroSIG: string = `<mat-icon  svgIcon="file-export" class="mat-icon svg-icon notranslate material-icons mat-icon-no-color" style="line-height: .6;">
  // <?xml version="1.0" encoding="UTF-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
  // <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="24px" height="24px" viewBox="0 0 24 24" enable-background="new 0 0 24 24" xml:space="preserve">  <image id="image0" width="24" height="24" x="0" y="0"
  // href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYEAYAAACw5+G7AAAABGdBTUEAALGPC/xhBQAAACBjSFJN
  // AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0T///////8JWPfcAAAA
  // B3RJTUUH5QQbDw8Ok7kgOgAABcJJREFUWMPtmGtQVVUUx3/n3ityIR/IFVBUFHzlpGaCyjhO+Jic
  // UatRLCZK07TxnYyvwak0h1HLF6UoimU+ysFRNFMzzTeICqMljzE1HRQxGfBVifi49/RhrTsXDW80
  // OPWl/eXH3Wettf9r77X32QcrAHQeLDQbC+9cptrmO0fYKU1Yekn9zlZv3zJR2DBQeOsJdpbhwi7f
  // Cm/+IXx4qnp7R5mwrV07gqYL/Rbhtdl8hCFthEaQd/sGY5RDvdsZzTXus0LrPe/29nJhcB3+b/9x
  // M2ofIjPT83cn3RNRC4Ub4vTBfcGwjcLc1cI8C/TqVZvRbQLf/tDjeXD2hsUuCJ0EruUQ9AwYvcH8
  // Du7HAg/hyieAHVpOAw4CLeDiZuAy3F4FxmsQWwgVO6DpO4CfJODXF6IHg7kZ9iUDYRDogCMDIHwk
  // FKUA/aHZIuAu+KwSfeYhMIaAZSiUBcH0hXClM2QPB2ukJtAuGeKuQ4fRQDi8WyD9FWuAaGAzPPhI
  // +q5uARpD2GGh4YDU7pLArnlgHwiTc+CcA1KiwYgC2kKnGJi4CCqASzbxHdgPzD0wLhyubgL2QvCn
  // QDn4nK4y0SuBAPArhbhrkDYTsoGzZ21gmnC6A2RaYFAHcP0ARVlAGSQ6gDyoSAfbOmAZOJ4D6oAR
  // AOwGbkDlQc9YF9fC+W7QxIARHwCjAV+4uBR+tUHIZDW8DnvOgBEMh3PA0RiIAdtyWWnygUli6meA
  // axvMXwJd+kOEv+hOn2A8VsMhwtQXhF/peZua67GpXc3+fauqx93G3hQO0/fPuKXCvBLbo4Z514Tf
  // 7xUGh/2zAQP2C+uNE14+96hti3bC39OFN7vUbEKCH6iuLLdw9xNL9Q535wqbuoS2wJrNXvvlgBPS
  // doBhQuTHYDghcoD2b1O7gprFs/kLQ5uprg8ft9BjrFWhsL4v1LHA9iJ53LIvGHNgYldIKgL7DOmP
  // 0MSMjVD8kifcifZgHQkZDiidAin5ULoUUpqA9W3Y+rLaXYHLRz1+xnZhayskdQT7W2DMhomhqqMP
  // 1NkJ2zeJznohwvBdGiBMX8n1P4NZWmeZmdCxBLJ8Yf9C2BsLCZuhfi6Ev64DV1kZdymZJljKYUUY
  // xJ+AFWMgvkT771Zf40YzqP8NhA+BvQmQMBOy6sL+NarjBsyZ6rGvp3emsJPVvMj+MsBt6BILxghY
  // UgjWF+HrOeBzAr6IgMoCMCOhZ8OalYW7Zev+q5sIRjbcPwujDoLzALyZCeY6mBIFNIAfkzx+j+4Z
  // L2/i6mYqUktnsYpdW6jU26Q5XsPqsWqueGymJ2p/jP5OFo6YpXxPOE2Tyy18kvAaJOBuOVq3d3cL
  // rdHQ4wiY82HBCcCElTrg+WxhP706LHMLuC2YFCXcFyFsUy4axnYFYybMGAbOU3A8GOxa1t1ueVOn
  // CVi/FLoa6Qy9+gT7BeoWCJnJ0HMwEAnzVNjWDUB7iB4EzmVQmgJYgWKwjofg3cDPcGy02A9JAHLg
  // /RvQaypk6f4z9bpM4hNkpwot7mO+6xZhyEDvq2F/RdhdjzOjP2SaEFMiJXfYB47FwLi5kFYA6Rmw
  // OgDSz2j/BLE7dAeyDIhxapw3NO48Haezdx1B54WR93Tp838TOk95d6y8KPzpjM5UqJwuh0JlMdPs
  // 4MyBIZ8DjWDsGDB/AbLA2RxS9QNndXtwVcChYsAO9NG4J4X3Ld51lDcU3sp/ytfpnrOFU3Ql41vr
  // g2LBxgzhEp24o7NqezWx1Ma5muYuQf2mdW9e3J+IbZWJNY74LyfQUHlceVXp/pjXFTCaPeUEmnQV
  // +p/xbm7TO1JoPRXSA1xVfJzzwLgAEbFw7QAk2eDaeUhqov1TxO5hPLiyPX5GjMbVCbDN8K7Dv5Xq
  // ztcEAjUBe13vjlYN7NBjzLgN9/Z4nl/IAEsJrAfKtkFlHJTlQuUosBTD+g5qtxPuVfkPiFGpcfUY
  // tY73rsNXT0HHlj8BZ8i3dEuossgAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjEtMDQtMjdUMTU6MTU6
  // MTQrMDA6MDBEewUOAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIxLTA0LTI3VDE1OjE1OjE0KzAwOjAw
  // NSa9sgAAAABJRU5ErkJggg==" />
  // </svg>
  // </mat-icon>`



  

}
