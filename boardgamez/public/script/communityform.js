function check_input()
{
   if (!document.board_form.title.value)
   {
       alert("제목을 입력하세요!");   
       document.board_form.title.focus();
       return;
   }

   if (!document.board_form.id.value)
   {
       alert("닉네임을 입력하세요!");   
       document.board_form.id.focus();
       return;
   }

   if (!document.board_form.text.value)
   {
       alert("게시글을 입력하세요!");   
       document.board_form.id.focus();
       return;
   }
  
   document.board_form.submit();
}

function check_comment()
{
   if (!document.comment_form.id.value)
   {
       alert("닉네임을 입력하세요!");   
       document.comment_form.id.focus();
       return;
   }

   if (!document.comment_form.text.value)
   {
       alert("댓글을 입력하세요!");   
       document.comment_form.text.focus();
       return;
   }
  
   document.comment_form.submit();
}