const bpmnUI = {
   listeners : {
      dblclickBlank:(process)=> {
		  console.log(process);
	  }, 
      dblclickElement:(element,e)=> {
		  console.log(element.id);
	  }
   }
};
export default bpmnUI;


