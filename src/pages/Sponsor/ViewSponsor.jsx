import { Card, Pagination, Spin, message } from "antd";
import React, { useEffect, useState } from "react";
import { getAllSponsors } from "../../api/sponsorApi";

const ViewSponsor = () => {
  const [sponsors, setSponsors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    fetchSponsorsData(pageNumber, pageSize);
  }, [pageNumber, pageSize]);

  const fetchSponsorsData = async (pageNumber, pageSize) => {
    setIsLoading(true);
    try {
      const data = await getAllSponsors(pageNumber, pageSize);
      setSponsors(data.result.items);
      setTotalItems(data.result.totalPages * pageSize); // Adjust based on actual total count if available
    } catch (error) {
      message.error("Error fetching sponsors");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-12">
      <h3 className="text-3xl font-bold mb-6">Danh sách nhà tài trợ</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <Spin size="large" />
        ) : (
          sponsors.map((sponsor) => (
            <Card
              key={sponsor.id}
              title={sponsor.name}
              style={{ width: "100%" }}
            >
              <p>{sponsor.description}</p>
              <img
                src={sponsor.img}
                alt="Sponsor"
                style={{ maxWidth: "100%", height: "auto", marginTop: "10px" }}
              />
            </Card>
          ))
        )}
      </div>
      <Pagination
        current={pageNumber}
        pageSize={pageSize}
        total={totalItems}
        onChange={(page, size) => {
          setPageNumber(page);
          setPageSize(size);
        }}
        showSizeChanger
        pageSizeOptions={["10", "20", "50", "100"]}
      />
    </div>
  );
};

export default ViewSponsor;
