class apiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filter() {
    let newQuery = {
      ...this.queryStr,
    };
    const exclude = ["sort", "page", "limit", "fields"];
    exclude.forEach(el => delete newQuery[el]);

    this.query = this.query.find(newQuery);
    return this;
  }

  limitFields() {
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(".").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(".").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("likes");
    }
    return this;
  }

  pagination() {
    const page = this.queryStr.page * 1 || 1;
    const limit = this.queryStr.limit * 1 || 10;

    let skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = apiFeatures;
