export default {
    template(source,data,pattern) {

        if(!pattern) {
		    pattern = /\{\{?(.*?)\}\}?/g;
		}

        return source.replace(pattern,
			(match, key, value) => {
	             return data[key];
		  });
	}
}