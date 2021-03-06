import { Component, OnInit } from '@angular/core';
import { SafTService } from 'src/app/shared/services/safT/saf-t.service';

@Component({
  selector: 'app-balance-sheet',
  templateUrl: './balance-sheet.component.html',
  styleUrls: ['./balance-sheet.component.scss']
})
export class BalanceSheetComponent implements OnInit {

  /**
   * Properties of each account:
   * - debit
   * - credit
   */
  private accounts: Object[] = [];

  private totalDebit: number = 0;
  private totalCredit: number = 0;

  private accountNames:Map<string, string> = new Map([
    ["11", "Caixa"],
    ["12", "Depósitos à Ordem"],
    ["21", "Contas a Receber de Clientes"],
    ["22", "Contas a Pagar a Fornecedores"],
    ["24", "Estado e Outros Entes Públicos"],
    ["31", "Compras"],
    ["32", "Mercadorias em Armazém / Trânsito"],
    ["36", "Produtos e Trabalhos em Curso"],
    ["61", "Custo das Mercadorias Vendidas"],
    ["62", "Fornecimentos e Serviços Externos"],
    ["71", "Vendas"],
    ["72", "Prestações de Serviços"]
  ]);


  constructor(private saft: SafTService) { }

  ngOnInit() {
    for (let i = 11; i <= 81; i++) {
      this.saft.get('AccountSum/' + i.toString()).subscribe(
        (data: Object) => {
          let id = i.toString()
          let accountSum = data['totalDebit'] - data['totalCredit'];
          if (accountSum != 0) {
            this.accounts.push({
              id: id,
              name: this.accountNames.has(id) ? this.accountNames.get(id) : ' - ',
              debit: accountSum > 0 ? accountSum : 0,
              credit: accountSum < 0 ? -accountSum : 0
            })
  
            this.totalDebit += data['totalDebit']
            this.totalCredit += data['totalCredit']
          }
        }
      );
    }
  }

}
