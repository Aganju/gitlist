import React, { Component } from 'react';
import ReactTable from "react-table";
import "react-table/react-table.css";

class Tables  extends Component {
  constructor(props){
    super(props);

    this.state = {
      sortby: 'stars'
    };
  }


  render() {
    const repoColumns =  [
      { Header: 'Name', accessor: 'name'  },
      { Header: 'Stars', accessor: 'stars' },
      { Header: 'Forks', accessor: 'forks' },
      { Header: 'Contributors', accessor: 'contributors' }
    ];

    const contribColumns = [
      { Header: 'Name', accessor: 'name' },
      { Header: 'Contributions', accessor: 'contributions' }
    ];

    return (
      <div className={"tables"}>
        <div className={"table"}>
          <span>Repositories</span>
          <ReactTable defaultSortDesc={true}
            columns={repoColumns} data={this.props.repoList}/>
        </div>

        <div className={"table"}>
          <span>Contributors</span>
          <ReactTable defaultSortDesc={true}
            columns={contribColumns} data={this.props.contributors}/>
        </div>
      </div>
    );
  }
}

export default Tables;
