function check_auc()
{
  if (!document.auc_form.auc_name.value)
  {
      alert("물품명을 입력하세요.");
      document.auc_form.auc_name.focus();
      return;
  }
  if (!document.auc_form.fin_date.value)
  {
      alert("종료 일시를 등록하세요.");
      document.auc_form.auc_fin_date.focus();
      return;
  }
  if (!document.auc_form.min_price.value)
  {
      alert("최소 낙찰가를 입력하세요.");
      document.auc_form.min_price.focus();
      return;
  }
  document.auc_form.submit();
}
